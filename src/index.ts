import { Construct } from "constructs";
import { TerraformStack } from 'cdktf';
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { KubernetesCluster, KubernetesClusterConfig, KubernetesClusterDefaultNodePool, KubernetesClusterServicePrincipal } from "@cdktf/provider-azurerm/lib/kubernetes-cluster";

export interface AksClusterStackProps {
  appName: string;
  clientId: string;
  clientSecret: string;
}

export class AksCluster extends Construct {
  public readonly clusterName: string;

  constructor(scope: TerraformStack, id: string, props: AksClusterStackProps) {
    super(scope, id);

    const appName = props.appName;
    const clientId = props.clientId;
    const clientSecret = props.clientSecret;

    const rg = new ResourceGroup(this, 'rg-k8s', {
      name: `rg-k8s-${appName}`,
      location: 'canadacentral'
    })

    const pool: KubernetesClusterDefaultNodePool = {
      name: 'default',
      vmSize: 'Standard_D2_V2',
      nodeCount: 1
    }

    const ident: KubernetesClusterServicePrincipal = {
      clientId: clientId,
      clientSecret: clientSecret
    }

    const k8sconfig: KubernetesClusterConfig = {
      dnsPrefix: `${appName}dnsprefix`,
      location: 'canadacentral',
      name: `aks-${appName}`,
      resourceGroupName: `rg-k8s-${appName}`,
      servicePrincipal: ident,
      defaultNodePool: pool,
      dependsOn: [rg]
    }

    const k8s = new KubernetesCluster(this, "k8scluster", k8sconfig);

    this.clusterName = k8s.name;
  }
}