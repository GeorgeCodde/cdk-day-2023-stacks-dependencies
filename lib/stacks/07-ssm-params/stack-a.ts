import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export class NetworkStack extends cdk.Stack {
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
    
    new ssm.StringParameter(this, 'VPCIdSSM', {
      parameterName: NetworkStack.getVpcIdSSMParamName(),
      stringValue: vpc.vpcId,
    });

    new ssm.StringParameter(this, 'ManageMentSGIdSSM', {
      parameterName: NetworkStack.getMgmntSgIdSSMParamName(),
      stringValue: managementSecurityGroup.securityGroupId,
    });
  }

  private static getVpcIdSSMParamName(): string {
    return '/network/vpc/id';
  }

  private static getMgmntSgIdSSMParamName(): string {
    return '/network/security-group/management/id';
  }

  public static getVpc(scope: Construct, id: string): ec2.IVpc {
    const vpcIdSSM = ssm.StringParameter.fromStringParameterName(scope, `${id}VPCId`,
      NetworkStack.getVpcIdSSMParamName(),
    );

    return ec2.Vpc.fromVpcAttributes(scope, id, {
      vpcId: vpcIdSSM.stringValue,
      availabilityZones: [
        'eu-west-1a',
        'eu-west-1b',
        'eu-west-1c',
      ],
    })
  }

  public static getManagementSecurityGroup(scope: Construct, id: string): ec2.ISecurityGroup {
    const managementSecurityGroupId = ssm.StringParameter.fromStringParameterName(scope, `${id}MgmntSGId`,
      NetworkStack.getMgmntSgIdSSMParamName(),
    );

    return ec2.SecurityGroup.fromSecurityGroupId(scope, id, managementSecurityGroupId.stringValue);
  }
}
