import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export class StackA extends cdk.Stack {
  public readonly vpc: ec2.IVpc;
  public readonly securityGroup: ec2.ISecurityGroup;
  public readonly securityGroupSSM: ssm.IStringParameter;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'MyVpc', {
      vpcName: 'cdk-day-vpc',
      maxAzs: 3,
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
    });

    const specialSecurityGroup = new ec2.SecurityGroup(this, 'MySpecialSecurityGroup', {
      securityGroupName: 'MySpecialSecurityGroup',
      description: 'This is a special security group',
      vpc: this.vpc,
    });

    const specialSecurityGroup2 = new ec2.SecurityGroup(this, 'MySpecialSecurityGroup2', {
      securityGroupName: 'MySpecialSecurityGroup2',
      description: 'This is a NEW special security group',
      vpc: this.vpc,
    });

    this.securityGroup = specialSecurityGroup;

    this.securityGroupSSM = new ssm.StringParameter(this, 'MySpecialSecurityGroupIDParameter', {
      parameterName: '/test/cdk-day/security-group/special/id',
      description: 'Parameter containing special security group ID',
      stringValue: specialSecurityGroup2.securityGroupId,
    });
  }
}
