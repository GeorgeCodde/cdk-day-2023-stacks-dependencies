import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface ExampleBProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  managementSecurityGroup: ec2.ISecurityGroup;
}

export class ExampleB extends cdk.Stack {

  constructor(scope: Construct, id: string, props: ExampleBProps) {
    super(scope, id, props);

    const mySecurityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', {
      vpc: props.vpc,
    });
    mySecurityGroup.addIngressRule(props.managementSecurityGroup, ec2.Port.allTraffic());
  }
}
