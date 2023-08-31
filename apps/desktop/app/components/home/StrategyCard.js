import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Box, MenuItem, Typography } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import BajajAreaChartCard from '../dashboard/BajajAreaChartCard.client';
import FileCopyIcon from '@mui/icons-material/FileCopy';
// types
import PropTypes from 'prop-types';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import TotalIncomeLightCard from 'components/dashboard/TotalIncomeLightCard';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const StrategyCard = ({ isLoading }) => {
    const theme = useTheme();
    const WalletList = new Array(10).fill(0)
    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="h4">策略列表</Typography>
                                    </Grid>
                                    <Grid item>
                                        <MoreHorizOutlinedIcon
                                            fontSize="small"
                                            sx={{
                                                color: theme.palette.primary[200],
                                                cursor: 'pointer'
                                            }}
                                            aria-controls="menu-popular-card"
                                            aria-haspopup="true"
                                        />

                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                {WalletList.map((i, index) => <>
                                    <TotalIncomeLightCard isLoading={isLoading} />
                                    <Divider sx={{ my: 1.5 }} />
                                </>)}
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                        <Button size="small" disableElevation>
                            View All
                            <ChevronRightOutlinedIcon />
                        </Button>
                    </CardActions>
                </MainCard>
            )}
        </>
    );
};

StrategyCard.propTypes = {
    isLoading: PropTypes.bool
};

export default StrategyCard;
