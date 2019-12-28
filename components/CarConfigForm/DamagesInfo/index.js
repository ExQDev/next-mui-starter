// @flow
import React, { Component } from 'react';
import { Grid, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import CreateIcon from '@material-ui/icons/Create';
import clsx from 'clsx';

import Switch from '../../Switch';
import AddDamagesModal from './addDamagesModal';

import messages from './messages';

import ExteriorBody from '../../../assets/svg/sedanBody.svg';
import InteriorBody from '../../../assets/svg/sedanInterior.svg';
import CloseIcon from '../../../assets/svg/closeIcon.svg';

const PensilIcon = withStyles({
  root: {
    color: '#1E88E5',
    fontSize: 25,
    background: '#EEF4F8',
    borderRadius: '50%',
    padding: 4,
    cursor: 'pointer',
  },
})(CreateIcon);

type Props = {
  classes: {
    container: {},
    damagesSelector: {},
    damagesStateContainer: {},
    stateLeftSelector: {},
    damagesInfo: {},
    damagesHeader: {},
    damagesInfoRow: {},
    damageType: {},
    damageDescription: {},
    damageIcon: {},
    infoTap: {},
    stateSelector: {},
    damageIconContainer: {},
    carBody: {},
    activeStateSelector: {},
    inactiveStateSelector: {},
  },
}

type State = {
  exterior: boolean,
  modalOpen: boolean,
  damages: Array<{
    damageDescription: string,
    damageDegree: string,
    damageType: string,
    position: {
      x: number,
      y: number
    },
  }>,
  clickPosition: null | {
    x: number,
    y: number,
  },
  editedDamage: {
    damageDescription: string,
    damageDegree: string,
    damageType: string,
  } | {},
};

const styles = (theme) => ({
  container: {
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      borderBottom: 'none',
      marginBottom: 0,
    },
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
    },
    borderBottom: '1px solid #EEF4F8',
    marginBottom: 30,
  },
  damagesSelector: {
    borderRight: '1px solid #EEF4F8',
    width: '35%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      borderBottom: '1px solid #EEF4F8',
    },
    [theme.breakpoints.up('sm')]: {
      width: '55%',
    },
    [theme.breakpoints.up('md')]: {
      width: '38%',
    },
  },
  damagesInfo: {
    width: '65%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      minHeight: 230,
      borderBottom: '1px solid #EEF4F8',
      marginBottom: 25,
    },
    [theme.breakpoints.up('sm')]: {
      width: '45%',
    },
    [theme.breakpoints.up('md')]: {
      width: '62%',
    },
  },
  damagesStateContainer: {
    height: 66,
    cursor: 'pointer',
    userSelect: 'none',
    background: '#FBFCFD',
    borderBottom: '1px solid #EEF4F8',
  },
  damagesHeader: {
    background: '#FBFCFD',
    borderBottom: '1px solid #EEF4F8',
    fontWeight: 'bold',
    fontSize: '10px',
    height: 66,
    color: '#99ABB4',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
    },
  },
  damagesInfoRow: {
    borderBottom: '1px solid #EEF4F8',
    fontSize: '12px',
    height: 66,
    color: '#455A64',
  },
  damageIcon: {
    position: 'absolute',
    fontSize: '10px',
    width: '16px',
    height: '16px',
    background: '#FC4B6C',
    border: '2px solid #FFFFFF',
    color: 'white',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
  },
  infoTap: {
    flex: 1,
    width: '100%',
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px 0',
    fontWeight: '600',
    fontSize: 16,
    color: '#99ABB4',
  },
  damageType: {
    fontWeight: '500',
    textDecoration: 'underline',
    color: '#1E88E5',
  },
  damageDescription: {
    fontSize: '10px',
    color: '#99ABB4',
  },
  stateSelector: {
    fontSize: '15px',
    marginLeft: '30px',
  },
  stateLeftSelector: {
    fontSize: '15px',
    marginRight: '30px',
  },
  activeStateSelector: {
    color: '#99ABB4',
    fontWeight: '500',
  },
  inactiveStateSelector: {
    color: '#455A64',
    fontWeight: 'bold',
  },
  damageIconContainer: {
    position: 'relative',
    margin: '30px 0',
  },
  carBody: {
    minHeight: 414,
    minWidth: 295,
  },
});

class DamagesInfo extends Component<Props, State> {
  state = {
    exterior: true,
    modalOpen: false,
    damages: [],
    clickPosition: null,
    editedDamage: {},
  };

  carBodyRef: any;

  switchHandler = () => {
    this.setState((prevState) => ({ exterior: !prevState.exterior }));
  };

  renderDamagesStateContainer = () => {
    const { exterior } = this.state;
    const { classes } = this.props;
    return (
      <Grid
        component="label"
        container
        justify="center"
        alignItems="center"
        className={this.props.classes.damagesStateContainer}
      >
        <Grid
          className={clsx(
            classes.stateLeftSelector,
            exterior ? classes.inactiveStateSelector : classes.activeStateSelector,
          )}
          item
        >
          <FormattedMessage {...messages.carExterior} />
        </Grid>
        <Grid item>
          <Switch
            checked={!exterior}
            onChange={this.switchHandler}
            value="checked"
          />
        </Grid>
        <Grid
          className={clsx(
            classes.stateSelector,
            exterior ? classes.activeStateSelector : classes.inactiveStateSelector,
          )}
          item
        >
          <FormattedMessage {...messages.carInterior} />
        </Grid>
      </Grid>
    );
  };

  selectDamagesHandler = ({ clientY, clientX }) => {
    const { x, y } = this.carBodyRef.lastElementChild.getBoundingClientRect();
    const viewport: ?HTMLElement = document.querySelector('meta[name="viewport"]');
    // $flow: content field exist in meta tag
    viewport.content = 'initial-scale=0.1';
    // $flow: content field exist in meta tag
    viewport.content = 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no';
    this.setState({ modalOpen: true, clickPosition: { x: clientX - x - 8, y: clientY - y - 8 } });
  };

  formHandler = (damage) => {
    if (this.state.damages.find((item) => item.position.x === damage.position.x)) {
      this.setState((prevState) => this.setState({
        damages: [
          damage,
          ...prevState.damages.filter((item) => item.position.x !== damage.position.x),
        ],
        modalOpen: false,
        editedDamage: {},
      }));
    } else {
      this.setState((prevState) => this.setState({
        damages: [...prevState.damages, damage],
        modalOpen: false,
        editedDamage: {},
      }));
    }
  };

  handleModalClose = () => this.setState({ modalOpen: false, editedDamage: {} });

  editDamage = (index: number) => {
    this.setState(({ damages }) => ({
      modalOpen: true,
      editedDamage: { ...damages[index] },
    }));
  };

  removeDamage(damageIndex) {
    this.setState((prevState) => this.setState({
      damages: prevState.damages.filter((item, index) => index !== damageIndex),
    }));
  }

  render() {
    const { classes } = this.props;
    const {
      clickPosition, modalOpen, damages, exterior, editedDamage,
    } = this.state;
    const CarBody = exterior ? ExteriorBody : InteriorBody;
    return (
      <Grid container className={classes.container}>
        <Grid className={classes.damagesSelector}>
          {this.renderDamagesStateContainer()}
          <Grid
            container
            alignItems="center"
            justify="center"
          >
            <Box className={classes.damageIconContainer} ref={(node) => { this.carBodyRef = node; }}>
              {
                damages.map((item, index) => {
                  if (item.exterior !== exterior) return null;
                  return (
                    <Box
                      style={{
                        left: item.position.x,
                        top: item.position.y,
                      }}
                      className={classes.damageIcon}
                      key={item.position.x}
                    >
                      {index + 1}
                    </Box>
                  );
                })
              }
              <CarBody className={classes.carBody} onClick={this.selectDamagesHandler} />
            </Box>

          </Grid>
        </Grid>
        <Grid className={classes.damagesInfo}>
          <Grid container className={classes.damagesHeader} alignItems="center">
            <Grid item xs={1} sm={2} md={1} container justify="center"><FormattedMessage {...messages.tableHeaderNumber} /></Grid>
            <Grid item xs={8} sm={7} md={8}><FormattedMessage {...messages.tableHeaderName} /></Grid>
            <Grid item xs={1}><FormattedMessage {...messages.tableHeaderDegree} /></Grid>
            <Grid item xs={1} container justify="center" />
            <Grid item xs={1} container justify="center" />
          </Grid>
          {
            damages.map((item, index) => (
              <Grid key={item.position.x} container alignItems="center" className={classes.damagesInfoRow}>
                <Grid item xs={1} sm={2} md={1} container justify="center">{index + 1}</Grid>
                <Grid item xs={8} sm={7} md={8}>
                  <Grid className={classes.damageType}>{item.damageType}</Grid>
                  <Grid className={classes.damageDescription}>{item.damageDescription}</Grid>
                </Grid>
                <Grid item xs={1}>{item.damageDegree}</Grid>
                <Grid item xs={1} container justify="center"><PensilIcon onClick={() => this.editDamage(index)} /></Grid>
                <Grid item xs={1} container justify="center"><CloseIcon onClick={() => this.removeDamage(index)} /></Grid>
              </Grid>
            ))
          }
          <Box className={classes.infoTap}><FormattedMessage {...messages.clickInfo} /></Box>
        </Grid>
        <AddDamagesModal
          exterior={exterior}
          clickPosition={clickPosition}
          open={modalOpen}
          onSubmit={this.formHandler}
          handleClose={this.handleModalClose}
          editedDamage={editedDamage}
        />
      </Grid>
    );
  }
}

export default withStyles(styles)(DamagesInfo);
