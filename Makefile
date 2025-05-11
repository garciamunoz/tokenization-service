IMAGE_NAME=tu_usuario/tokenization-service:latest
CLUSTER_NAME=your-eks-cluster
K8S_FILE=k8s-deployment.yaml

build:
	docker build -t $(IMAGE_NAME) .

push:
	docker push $(IMAGE_NAME)

deploy:
	kubectl apply -f $(K8S_FILE)

redeploy: build push deploy