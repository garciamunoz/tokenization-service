#!/bin/bash

set -e

# Variables de configuración
API_NAME="tokenization-service"
REGION="us-east-1"
STAGE_NAME="prod"
ECR_REPO_NAME="tokenization-service"
CLUSTER_NAME="my-eks-cluster"
DEPLOYMENT_FILE="k8s-deployment.yaml"

# Paso 1: Construir imagen Docker SIN CACHÉ
echo "🔧 Construyendo imagen Docker sin caché..."
docker build --no-cache -t $ECR_REPO_NAME .

# Paso 2: Login a ECR
echo "🔐 Logueando en ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin "$(aws sts get-caller-identity --query "Account" --output text).dkr.ecr.$REGION.amazonaws.com"

# Paso 3: Crear repositorio ECR si no existe
echo "📦 Verificando si existe el repositorio ECR '$ECR_REPO_NAME'..."
aws ecr describe-repositories --repository-names $ECR_REPO_NAME --region $REGION >/dev/null 2>&1 || {
  echo "📁 Repositorio no encontrado. Creando..."
  aws ecr create-repository --repository-name $ECR_REPO_NAME --region $REGION
}

# Paso 4: Tag y push
ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
IMAGE_TAG="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPO_NAME:latest"
docker tag $ECR_REPO_NAME $IMAGE_TAG
docker push $IMAGE_TAG
echo "✅ Imagen subida: $IMAGE_TAG"

# Paso 5: Forzar redeploy eliminando pods del deployment (se regeneran automáticamente)
echo "♻️ Eliminando pods actuales para forzar redeploy..."
kubectl delete pods -l app=tokenization-service --ignore-not-found

# Paso 6: Aplicar manifiesto Kubernetes
echo "🚀 Aplicando manifiesto Kubernetes..."
kubectl apply -f $DEPLOYMENT_FILE

# Paso 7: Obtener URL del servicio en EKS
echo "🌐 Obteniendo LoadBalancer URL..."
EKS_SERVICE_URL=$(kubectl get svc tokenization-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "🔗 EKS URL: $EKS_SERVICE_URL"

# Paso 8: Configurar API Gateway
echo "📡 Configurando API Gateway..."

API_ID=$(aws apigatewayv2 get-apis --region $REGION --query "Items[?Name=='$API_NAME'].ApiId" --output text)
if [ -z "$API_ID" ]; then
  echo "🚀 API no encontrada. Creando nueva API HTTP..."
  API_ID=$(aws apigatewayv2 create-api --name "$API_NAME" --protocol-type HTTP --region $REGION --query "ApiId" --output text)
  echo "✅ API creada con ID: $API_ID"
else
  echo "✅ API existente encontrada: $API_ID"
fi

echo "🔁 Creando integración para POST /tokenize..."
TOKENIZE_INTEGRATION_ID=$(aws apigatewayv2 create-integration --api-id $API_ID --integration-type HTTP_PROXY --integration-method POST --integration-uri "http://$EKS_SERVICE_URL/tokenize" --payload-format-version 1.0 --region $REGION --query "IntegrationId" --output text)

echo "🔁 Creando integración para GET /detokenize/{token}..."
DETOKENIZE_INTEGRATION_ID=$(aws apigatewayv2 create-integration --api-id $API_ID --integration-type HTTP_PROXY --integration-method GET --integration-uri "http://$EKS_SERVICE_URL/detokenize/{token}" --payload-format-version 1.0 --region $REGION --query "IntegrationId" --output text)

echo "📍 Creando rutas..."
aws apigatewayv2 create-route --api-id $API_ID --route-key "POST /tokenize" --target "integrations/$TOKENIZE_INTEGRATION_ID" --region $REGION || true
aws apigatewayv2 create-route --api-id $API_ID --route-key "GET /detokenize/{token}" --target "integrations/$DETOKENIZE_INTEGRATION_ID" --region $REGION || true

echo "🚦 Verificando stage '$STAGE_NAME'..."
STAGE_EXISTS=$(aws apigatewayv2 get-stages --api-id $API_ID --region $REGION --query "Items[?StageName=='$STAGE_NAME'].StageName" --output text)
DEPLOYMENT_ID=$(aws apigatewayv2 create-deployment --api-id $API_ID --region $REGION --query "DeploymentId" --output text)
if [ -z "$STAGE_EXISTS" ]; then
  aws apigatewayv2 create-stage --api-id $API_ID --stage-name $STAGE_NAME --deployment-id $DEPLOYMENT_ID --region $REGION
else
  aws apigatewayv2 update-stage --api-id $API_ID --stage-name $STAGE_NAME --deployment-id $DEPLOYMENT_ID --region $REGION
fi

echo "✅ Despliegue completo."
echo "🌐 URL pública: https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE_NAME"
