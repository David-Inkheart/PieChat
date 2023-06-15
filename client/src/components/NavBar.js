import React, { useContext, useState } from 'react';
import { Input, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function NavBar() {
  const { user, logout } = useContext(AuthContext);

  const pathname = window.location.pathname;
  // console.log(pathname); e.g /signup

  const path = pathname === '/' ? 'home' : pathname.substr(1);
    const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const navBar = user ? (
      <Menu pointing size='massive' color='orange' stackable>
          {/* <Menu.Item
            name='PieChat'
            active={activeItem === 'home'}
            onClick={handleItemClick}
            as={Link}
            to="/"
            style={{ color: 'teal' }}
          /> */}
          <Menu.Item
            active={activeItem === 'home'}
            onClick={handleItemClick}
            as={Link}
            to="/"
            style={{ padding: 2 }} // Remove default padding to ensure the image fits properly
          >
          <img
            src='/images/piechat.png'
          alt="Logo"
          style={{ height: '100%' }}
          />
          </Menu.Item>
          <Menu.Item>
            <Input icon='search' placeholder='Search...' />
          </Menu.Item>
          <Menu.Menu position='right'>
          <Menu.Item
            name={`welcome ${user.username}`}
            active
            as={Link}
            to="/"
            style={{ color: 'teal' }}
          />
          <Menu.Item
            name='logout'
            onClick={logout}
          />
        </Menu.Menu>
      </Menu>
    
  ) : (
      <Menu pointing size='massive' color='orange' stackable>
        {/* <Menu.Item 
          name='PieChat'
          active={activeItem === 'home'}
          onClick={handleItemClick}
          as={Link}
          to="/"
        /> */}
        <Menu.Item
            active={activeItem === 'home'}
            onClick={handleItemClick}
            as={Link}
            to="/"
            style={{ padding: 1 }} // Remove default padding to ensure the image fits properly
          >
            <img src='/images/piechat.png' alt="Logo" style={{ height: '100%' }} />
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={handleItemClick}
            as={Link}
            to="/login"
          />
          <Menu.Item
            name='signup'
            active={activeItem === 'signup'}
            onClick={handleItemClick}
            as={Link}
            to="/register"
          />
        </Menu.Menu>
      </Menu>
  )
    return navBar;
  }

export default NavBar;