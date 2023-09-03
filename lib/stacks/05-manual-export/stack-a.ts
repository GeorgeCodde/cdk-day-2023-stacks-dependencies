import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class ExportingStack extends cdk.Stack {
  public readonly vpcId: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'MyVpc', {
      vpcName: 'cdk-day-vpc',
      maxAzs: 3,
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
    });

    const managementSecurityGroup = new ec2.SecurityGroup(this, 'ManagementSecurityGroup', {
      vpc,
    });

    this.vpcId = new cdk.CfnOutput(this, 'VpcId', {
      exportName: 'CDKDayVpcId',
      value: vpc.vpcId,
    });

    new cdk.CfnOutput(this, 'ManagementSecurityGroupId', {
      exportName: 'CDKDayManagementSecurityGroupId',
      value: managementSecurityGroup.securityGroupId,
    });
  }
}
