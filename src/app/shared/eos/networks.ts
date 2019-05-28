import { IEOSNetwork } from '../typings';
import { JsonRpc } from 'eosjs';

const KylinNetwork: IEOSNetwork = {
    chain_id: `5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191`,
    node_endpoint: `https://api-kylin.eoslaomao.com`,
};

const MainNetwork: IEOSNetwork = {
    chain_id: `aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906`,
    node_endpoint: `https://public.eosinfra.io`,
};

function getNetwork() {
    switch (process.env.REACT_APP_EOS_NETWORK) {
        case `kylin`:
            return KylinNetwork;
        default:
            return MainNetwork;
    }
}

const network = getNetwork();

const rpc = new JsonRpc(network.node_endpoint);

export { getNetwork, rpc };
