import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class ExampleA extends cdk.Stack {
  public readonly vpc: ec2.IVpc;
  public readonly managementSecurityGroup: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'MyVpc', {
      vpcName: 'cdk-day-vpc',
      maxAzs: 3,
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
    });

    this.managementSecurityGroup = new ec2.SecurityGroup(this, 'ManagementSecurityGroup', {
      vpc: this.vpc,
    });
  }
}
