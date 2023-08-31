import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import BalanceCard from 'components/home/BalanceCard';
import WalletCard from 'components/home/WalletCard';
import StrategyCard from 'components/home/StrategyCard';

import WalletCardList from 'components/wallet-manage/WalletCardList';

import TotalOrderLineCard from 'components/dashboard/TotalOrderLineCard';
import TotalIncomeDarkCard from 'components/dashboard/TotalIncomeDarkCard';
import TotalIncomeLightCard from 'components/dashboard/TotalIncomeLightCard';
import TotalGrowthBarCard from 'components/dashboard/TotalGrowthBarCard';
import PopularCard from 'components/dashboard/PopularCard';

// meta export
export const meta = () => ({
    title: 'Dashboard | Berry - React Material Admin Dashboard Template',
    description:
        'Start your next React project with Berry admin template. It build with Reactjs, Material-UI, Redux, and Hook for faster web development.'
});

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const theme = useTheme();
    useEffect(() => {
        setLoading(false);
    }, []);
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item lg={12} md={12} sm={12} xs={12} spacing={gridSpacing}>
                <WalletCardList isLoading={isLoading} />
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={6}>
                        <WalletCard isLoading={isLoading} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StrategyCard isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={12}>
                        <TotalGrowthBarCard isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
