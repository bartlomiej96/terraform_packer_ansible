data "aws_ami" "tomcat_ami" {
  most_recent      = true
  owners           = ["self"]

  filter {
    name   = "name"
    values = ["tomcat_*"]
  }

  filter {
      name   = "virtualization-type"
      values = ["hvm"]
    }

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }
}

resource "aws_instance" "example" {
  count = 1
  ami           = data.aws_ami.tomcat_ami.id
  instance_type = "t2.micro"
  security_groups = ["exer-sec"]
	
  tags = {
    Name = "Exercise VM ${count.index}"
  }
}
