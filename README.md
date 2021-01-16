# Terraform  | Packer | Ansible

[1. Introduction and repository purpose](#1-introduction-and-repository-purpose)

[2. Technology used](#2-technology-used)

&nbsp;&nbsp;[2.1 Docker](#21-docker)

&nbsp;&nbsp;[2.2 Ansible](#22-ansible)

&nbsp;&nbsp;[2.3 Packer](#23-packer)

&nbsp;&nbsp;[2.4 Terraform](#24-terraform)

[3. Exercise](#3-exercise)

## 1. Introduction and repository purpose

This repo is a simple exercise created in order to test using combination of Packer | Ansible | Terraform
We are looking to create AMI with tomcat set up and then deploy and instance using that AMI.
When its successfull we should be able to see a sample page on port 8080 when ec2 instance is up and running.

## 2. Technology used

### 2.1 Docker

Docker is used in this exercise in order to deploy containers in which we will run process deploying AMI using Packer & Ansible and create ec2 instance using Terraform.

Docker images used:

```bash
docker pull gaahrdner/packer-ansible-resource
docker pull hashicorp/terraform
```

Docker commands for Powershell:

```bash
docker run  -it -v ${PWD}:/test --entrypoint="/usr/bin/env" gaahrdner/packer-ansible-resource /bin/sh

docker run  -it -v ${PWD}:/test --entrypoint="/usr/bin/env" hashicorp/terraform /bin/sh
```


Initially I wanted to use a packer docker image provided by hashicorp but there was an issue with Ansible provisioner.

### 2.2 [Ansible](https://docs.ansible.com/ansible/latest/index.html)

Ansible is an IT automation tool. It can configure systems, deploy software, and orchestrate more advanced IT tasks such as continuous deployments or zero downtime rolling updates.

In this exercise we will be leveraging Ansible Playbook.

Playbooks record and execute Ansible’s configuration, deployment, and orchestration functions. They can describe a policy you want your remote systems to enforce, or a set of steps in a general IT process.

If Ansible modules are the tools in your workshop, playbooks are your instruction manuals, and your inventory of hosts are your raw material.

### 2.3 [Packer](https://www.packer.io/docs)

HashiCorp Packer automates the creation of any type of machine image.

Packer is an open source tool for creating identical machine images for multiple platforms from a single source configuration. Packer is lightweight, runs on every major operating system, and is highly performant, creating machine images for multiple platforms in parallel.

### 2.4 [Terraform](https://www.terraform.io/docs/index.html)

Terraform is an open-source infrastructure as code software tool that provides a consistent CLI workflow to manage hundreds of cloud services. 

Terraform generates an execution plan describing what it will do to reach the desired state, and then executes it to build the described infrastructure. As the configuration changes, Terraform is able to determine what changed and create incremental execution plans which can be applied.

## 3. Exercise

### 1. Create Access key
You will need an access key in order to connect to your AWS env and deploy your infrastructure there.
Whenever you start a new container provide your credentials in below format:

```bash
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export AWS_DEFAULT_REGION=
```

### 2. Create AMI
Start a packer docker container
```bash
docker run  -it -v ${PWD}:/test --entrypoint="/usr/bin/env" gaahrdner/packer-ansible-resource /bin/sh
```
Provide AWS credentials.

Check a packer file and see if all of the vars are correct. You might want to change an ami used or an instance type.

Instance type is currently set to use t2.micro which should not create any huge costs.

If you change a name value, you might break a later instance deployment as it's filtering AMIs by name.

Run packer builder using below command:
```bash
packer build tomcatAMI.js
```

It will start by building an EC2 instance and wait for ssh connection to be enabled.

When this happens, Ansible playbook will be run and go through various steps required to run tomcat.

After that EC2 instance will be stopped, AMI created, and ec2 instance terminated.

Keep in mind that the whole process might take a couple of minutes.

When it's finished you can exit docker container.

### 3. Deploy EC2 instance using previously created AMI
Start a terraform docker container
```bash
docker run  -it -v ${PWD}:/test --entrypoint="/usr/bin/env" hashicorp/terraform /bin/sh
```
Provide AWS credentials.

After you do that, you can initialize a working dir containing config files.

```bash
terraform init
```

This will create a .tfstate file keeping your whole infrastructure maitained using terraform.

You can now run a plan, that will plan out all of the components to be created based on your .tf file.

```bash
terraform plan
```

You will see your resources to be Added/Changed/Deleted in an easy to read Graph structure.

If you are satisfied with the results, you can apply plan.

```bash
terraform apply
```

After EC2 instance, built based on AMI we created previously, is up and running you can check a sample page by going to instance default IPv4 address. For example:

http://52.59.254.96:8080/sample

If you can see it, congrats!

You might just want to remove everything you create using terraform in order to save costs. You can do that by running:

```bash
terraform destroy
```

It will tear down you whole infrastructure create using Terraform and maitained in .tfstate file.