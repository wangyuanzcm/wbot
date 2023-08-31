import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';
import EarningCard from 'components/dashboard/EarningCard';

// project imports
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';

// types
import PropTypes from 'prop-types';

// assets
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const BalanceCard = ({ isLoading }) => {
    const theme = useTheme();
    const walletData = new Array(30).fill(0);

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
                                        <Typography variant="h4">当前余额</Typography>
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
                            {/* 这里只展示前四个 */}
                            {walletData.slice(0, 4).map((i, index) => (
                                <Grid item lg={3} md={3} sm={3} xs={3} spacing={gridSpacing} key={index}>
                                    <EarningCard isLoading={isLoading} />
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </MainCard>
            )}
        </>
    );
};

BalanceCard.propTypes = {
    isLoading: PropTypes.bool
};

export default BalanceCard;
