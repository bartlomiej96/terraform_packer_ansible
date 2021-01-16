{
  "variables": {
    "aws_access_key": "{{env `AWS_ACCESS_KEY_ID`}}",
    "aws_secret_key": "{{env `AWS_SECRET_ACCESS_KEY`}}",
    "region": "{{ env `AWS_DEFAULT_REGION` }}",
    "instance_type": "t2.micro",
    "ssh_username": "ec2-user",
    "ami_name": "tomcat_{{timestamp}}"
  },
  "builders": [
    {
      "type": "amazon-ebs",
      "access_key": "{{user `aws_access_key`}}",
      "secret_key": "{{user `aws_secret_key`}}",
      "region": "{{user `aws_region`}}",
      "source_ami": "ami-00a205cb8e06c3c4e",
      "instance_type": "{{user `instance_type`}}",
      "ssh_username": "{{user `ssh_username`}}",
      "ami_name": "{{user `ami_name`}}"
    }
  ],
  "provisioners": [
  {
        "type" : "ansible",
        "playbook_file": "./playbooks/tomcatSetup.yml"
  }]
}
