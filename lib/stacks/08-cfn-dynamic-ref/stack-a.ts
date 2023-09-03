import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export class CoreStack extends cdk.Stack {
  public readonly managementSecurityGroupIdSSM: ssm.IStringParameter;

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

    const managementSecurityGroup2 = new ec2.SecurityGroup(this, 'ManagementSecurityGroup2', {
      vpc,
    });

    new ssm.StringParameter(this, 'VPCIdSSM', {
      parameterName: CoreStack.getVpcIdSSMParamName(),
      stringValue: vpc.vpcId,
    });

    new ssm.StringParameter(this, 'ManageMentSGIdSSM', {
      parameterName: CoreStack.getMgmntSgIdSSMParamName(),
      stringValue: managementSecurityGroup2.securityGroupId,
    });
  }

  private static getVpcIdSSMParamName(): string {
    return '/network/vpc/id';
  }

  private static getMgmntSgIdSSMParamName(): string {
    return '/network/security-group/management/id';
  }

  private static getReferenceFromSSMParameter(
    ssmParameterName: string,
    ssmParameterVersion: number,
  ): string {
    return new cdk.CfnDynamicReference(
      cdk.CfnDynamicReferenceService.SSM,
      `${ssmParameterName}:${String(ssmParameterVersion)}`,
    ).toString();
  }

  public static getVpc(scope: Construct, id: string): ec2.IVpc {
    const vpcId = CoreStack.getReferenceFromSSMParameter(CoreStack.getVpcIdSSMParamName(), 1);

    return ec2.Vpc.fromVpcAttributes(scope, id, {
      vpcId,
      availabilityZones: [
        'eu-west-1a',
        'eu-west-1b',
        'eu-west-1c',
      ],
    })
  }

  public static getManagementSecurityGroup(scope: Construct, id: string): ec2.ISecurityGroup {
    const managementSecurityGroupId = CoreStack.getReferenceFromSSMParameter(
      CoreStack.getMgmntSgIdSSMParamName(),
      1,
    );

    return ec2.SecurityGroup.fromSecurityGroupId(scope, id, managementSecurityGroupId);
  }
}
