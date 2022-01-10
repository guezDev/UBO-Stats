import React from 'react';
import logo from '../logo.jpg';
import iconLienUBO from '../images/icon-lien-ubo.png';
import iconLienAide from '../images/icon-lien-aide.png';
import '../css/Header.css';

class Header extends React.Component {
	render() {
		return (
			<header>
				<div id="bloc-jaune">
					<div id="bloc-logo">
							<img src={logo} alt="logo UBO" />
							<h1><i>Stats</i></h1>
					</div>
					<div id="bloc-liens-externes">
						<a target="_blank" rel="noreferrer" href='https://www.univ-brest.fr/'>
							<img src={iconLienUBO} alt="Icone lien site UBO" />
						</a>
						<a target="_blank" rel="noreferrer" href='https://www.univ-brest.fr/dsiun/'>
							<img src={iconLienAide} alt="Icone lien site UBO" />
						</a>
					</div>
				</div>
				<div id="bloc-noir"></div>
			</header>
		);
	}
}

export default Header;

