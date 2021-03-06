import React from 'react';
import ListIcon from '@material-ui/icons/List';
import HelpIcon from '@material-ui/icons/Help';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import MenuIcon from '@material-ui/icons/Menu';
import { AccountCircle } from '@material-ui/icons';
import { 
  AppBar,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
  Toolbar,
  Typography,
  Menu, 
  MenuItem,
} from '@material-ui/core';
import { 
  makeStyles, 
  useTheme, 
  Theme, 
  createStyles 
} from '@material-ui/core/styles';
import { Link, Route } from 'react-router-dom';

import { UserData } from '../../../stores/Authentication';
import Projects from '../Projects';
import Project from '../Project';
import Login from '../../pages/Login/Login';
import Registration from '../../pages/Registration';
import AddProject from '../AddProject';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: '#8c3e3e',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    title: {
      flexGrow: 1,
    },
    link: {
      textDecoration: 'none',
      color: '#fafafa'
    },
    icon: {
      color: '#fafafa'
    }
  }),
);

interface Props {
  userData: UserData | undefined;
  isUserAuthorized: boolean;
  logout: () => void;
}

export default ({ userData, isUserAuthorized, logout }: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <Link to='/' className={classes.link}>
          <ListItem button>
            <ListItemIcon className={classes.icon}><ListIcon /></ListItemIcon>
            <ListItemText primary='??????????????' />
          </ListItem>
        </Link>
        <Link to='#' className={classes.link}>
          <ListItem button>
            <ListItemIcon className={classes.icon}><HelpIcon /></ListItemIcon>
            <ListItemText primary='?????? ??????????????????' />
          </ListItem>
        </Link>
        {!isUserAuthorized &&
          <Link to='/auth/login' className={classes.link}>
            <ListItem button>
              <ListItemIcon className={classes.icon}><VpnKeyIcon /></ListItemIcon>
              <ListItemText primary='??????????' />
            </ListItem>
          </Link>
        }
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar} style={{backgroundColor: '#8c3e3e'}}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
          </Typography>
          {isUserAuthorized && (
            <>
              <Typography>
                {userData?.firstName} {userData?.lastName}
              </Typography>
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={logout}>??????????</MenuItem>
                </Menu>
              </div>
            </>
          )}
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Route exact path='/auth/login' component={Login} />
        <Route exact path='/auth/registration' component={Registration} />
        <Route exact path='/' component={Projects} />
        <Route exact path='/project/add' component={AddProject} />
        <Route exact path='/:id' component={Project} />
      </main>
    </div>
  );
}
