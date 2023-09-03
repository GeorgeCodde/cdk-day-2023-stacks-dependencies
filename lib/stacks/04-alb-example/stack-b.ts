import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as alb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

interface ServiceStackProps extends cdk.StackProps {
  ecsCluster: ecs.ICluster;
  albListener: alb.IApplicationListener;
}

export class ServiceStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: ServiceStackProps) {
    super(scope, id, props);

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'MyTask');
    const servicePort = 1234;

    taskDefinition.addContainer('MyApp', {
      image: ecs.RepositoryImage.fromEcrRepository(
        ecr.Repository.fromRepositoryName(this, 'MyAppEcrRepo', 'my-app'),
        'latest',
      ),
      portMappings: [{ containerPort: servicePort }]
    });

    const service = new ecs.FargateService(this, 'MyEcsService', {
      cluster: props.ecsCluster,
      taskDefinition,
    });

    props.albListener.addTargets('MyServiceTarget', {
      port: servicePort,
      protocol: alb.ApplicationProtocol.HTTP,
      targets: [service],
    });
  }
}
