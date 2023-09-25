#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Tagger } from '../lib/aspects';

const app = new cdk.App();

/**
 * 01 - Basic Example
 * 
 * Simple non-deterministic inherit dependency between a stackA defining VPC and 
 * stackB creating a security group within that VPC
 * 
*/
import { ExampleA, ExampleB } from '../lib/stacks';

const stackA = new ExampleA(app, 'ExampleA');

const stackB = new ExampleB(app, 'ExampleB', {
  vpc: stackA.vpc,
  managementSecurityGroup: stackA.managementSecurityGroup,
});

/**
 * 02 - DB Example
 * 
 * Simple non-deterministic inherit dependency between a stackA defining a Database and
 * stackB passing its endpoint to an ECS service
 * 
import { StackA, StackB } from '../lib/stacks';

const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const stackA = new StackA(app, 'ExampleA', { env });

const stackB = new StackB(app, 'ExampleB', {
  env,
  db: stackA.db,
});
*/

/**
 * 03 - CloudFront example
 * 
 * Simple deterministic reflective dependency of CloudFront distribution that uses bucket in other stack
 * 
import { SharedStack, AppStack } from '../lib/stacks';

const stackA = new SharedStack(app, 'ExampleA');

const stackB = new AppStack(app, 'ExampleB', {
  distribution: stackA.distribution,
});
 */

/**
 * 04 - ALB example
 * 
 * Deterministic reflective dependency of ALB that have as target a ECS service defined in other stack
 * 
import { AlbStack, ServiceStack } from '../lib/stacks';

const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const stackA = new AlbStack(app, 'ExampleA', { env });

const stackB = new ServiceStack(app, 'ExampleB', {
  env,
  ecsCluster: stackA.ecsCluster,
  albListener: stackA.albListener,
});
 */

/**
 * 05 - Manual export
 * 
 * Explicit export and import of values across two stacks
 * 
import { ExportingStack, ImportingStack } from '../lib/stacks';

const stackA = new ExportingStack(app, 'ExampleA');

const stackB = new ImportingStack(app, 'ExampleB', {
  vpcId: stackA.vpcId,
});
stackB.addDependency(stackA);
*/

/**
 * 06 - Static values
 * 
 * Share static values across stacks through code
 * 
import { CommonStack, NewServiceStack } from '../lib/stacks';

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const stackA = new CommonStack(app, 'ExampleA', { env });

const stackB = new NewServiceStack(app, 'ExampleB', { env });

stackB.addDependency(stackA);
 */

/**
 * 07 - SSM parameters
 * 
 * Share values across stacks using SSM parameters
 * 
import { NetworkStack, ApplicationStack } from '../lib/stacks';

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const stackA = new NetworkStack(app, 'ExampleA', { env });

const stackB = new ApplicationStack(app, 'ExampleB', { env });

stackB.addDependency(stackA);
 */

/**
 * 08 - SSM parameters
 * 
 * Share values across stacks using SSM parameters with CloudFormation Dynamic references
 * 
import { CoreStack, DemoStack } from '../lib/stacks';

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const stackA = new CoreStack(app, 'ExampleA', { env });

const stackB = new DemoStack(app, 'ExampleB', { env });

stackB.addDependency(stackA);
*/

cdk.Aspects.of(stackA).add(new Tagger({
  project: 'cdkday-talk',
  projectVersion: 'v1',
}));

cdk.Aspects.of(stackB).add(new Tagger({
  project: 'cdkday-talk',
  projectVersion: 'v1',
}));
