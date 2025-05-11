#!/bin/bash

# Variables
AWS_ACCOUNT_ID=423469511259
REGION=us-east-1
REPOSITORY_NAME=tokenization-service
IMAGE_TAG=latest

# Login a ECR
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Construir la imagen
docker build -t $REPOSITORY_NAME .

# Taggear la imagen para ECR
docker tag $REPOSITORY_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPOSITORY_NAME:$IMAGE_TAG

# Subir la imagen a ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPOSITORY_NAME:$IMAGE_TAG