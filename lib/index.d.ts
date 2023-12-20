import { Construct } from "constructs";
import { TerraformStack } from 'cdktf';
export interface AksClusterStackProps {
    appName: string;
    clientId: string;
    clientSecret: string;
}
export declare class AksCluster extends Construct {
    readonly clusterName: string;
    constructor(scope: TerraformStack, id: string, props: AksClusterStackProps);
}
