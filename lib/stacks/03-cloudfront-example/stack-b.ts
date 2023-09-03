import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';

interface AppStackProps extends cdk.StackProps {
  distribution: cloudfront.IDistribution;
}

export class AppStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const appBucket = new s3.Bucket(this, 'MyAppBucket');

    const distribution = props.distribution as cloudfront.Distribution;
    distribution.addBehavior('/my-app/', new origins.S3Origin(appBucket));
  }
}
