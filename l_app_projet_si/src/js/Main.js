import React from 'react';
import {Button} from 'react-bootstrap'
import { MDBContainer } from 'mdbreact';
import {Bar, Line} from 'mdbreact/node_modules/react-chartjs-2'
import iconBarChart from '../images/bar-chart.png';
import iconLineGraph from '../images/line-graph.png';
import '../css/Main.css';

class Main extends React.Component {
	constructor(props) {
		super(props)
		this.state={
			annees: [],
			anneeD: 0,
			anneeF: 3000,
			bar_chart: true,
			line_graph: false,
			isLoaded: false,
			message_choix_annee: "",
			dataBar:{},
			dataLine: {}
		}
	}

	componentDidMount() {
		this.setState({annees: this.props.annees})
	}

	componentDidUpdate(prevPros, prevState) {
		if(prevPros.data!==this.props.data || prevPros.data_graphique!==this.props.data_graphique || prevState.anneeD!==this.state.anneeD || prevState.anneeF!==this.state.anneeF) {
			let _dataBar={}
			_dataBar["labels"]=this.props.annees.filter(annee=> annee >= this.state.anneeD && annee <= this.state.anneeF)
			_dataBar["datasets"]=this.props.data_graphique.map(val => val)

			let _data=this.props.data_graphique.map(data => data["annee_effectif"]), _data_keys, data_
			
			for(let i=0; i<_dataBar["datasets"].length;i++) {
				_data_keys=Object.keys(_data[i])
				_data_keys=_data_keys.map(val => Number(val))
				data_=[]
				for(let j=0; j<_data_keys.length;j++) {
					if(_dataBar["labels"].includes(_data_keys[j])) {
						data_.push(_data[i][_data_keys[j]])
					}
				}
				_dataBar["datasets"][i]["data"]=data_

			}

			_dataBar["barChartOptions"]={
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					xAxes: [
					{
						barPercentage: 1,
						gridLines: {
						display: true,
						color: "rgba(0, 0, 0, 0.1)"
						}
					}
					],
					yAxes: [
					{
						gridLines: {
						display: true,
						color: "rgba(0, 0, 0, 0.1)"
						},
						ticks: {
						beginAtZero: true
						}
					}
					]
				}
			}

			/**** DataLine */

			let _dataLine={}
			_dataLine["labels"]=this.props.annees.filter(annee=> annee >= this.state.anneeD && annee <= this.state.anneeF)
			_dataLine["datasets"]=this.props.data_graphique_line.map(val => val)

			_data=this.props.data_graphique_line.map(data => data["annee_effectif"])
			
			for(let i=0; i<_dataLine["datasets"].length;i++) {
				_data_keys=Object.keys(_data[i])
				_data_keys=_data_keys.map(val => Number(val))
				data_=[]
				for(let j=0; j<_data_keys.length;j++) {
					if(_dataLine["labels"].includes(_data_keys[j])) {
						data_.push(_data[i][_data_keys[j]])
					}
				}
				_dataLine["datasets"][i]["data"]=data_

			}

			
			//console.log(_dataBar);
			this.setState({dataBar: _dataBar, dataLine: _dataLine, annees: this.props.annees})
		}
	}

	handleChangeAnneeD(e) {
		if(Number(e.target.value)>this.state.anneeF && this.state.anneeF!==0) {
			this.setState({message_choix_annee: "L'année de début doit être inférieure à l'année de fin"})
		} else {
			this.setState({anneeD: Number(e.target.value), message_choix_annee: ""})
		}
	}

	handleChangeAnneeF(e) {
		if(Number(e.target.value)<this.state.anneeD && this.state.anneeD!==0) {
			this.setState({message_choix_annee: "L'année de fin doit être supérieure à l'année de début"})
		} else {
			this.setState({anneeF: Number(e.target.value), message_choix_annee: ""})
		}
	}

	handleClickBar() {
		this.setState({bar_chart: true, line_graph: false})
	}

	handleClickLine() {
		this.setState({line_graph: true, bar_chart: false})
	}

	render() {
		//console.log(this.state.dataBar);
		return (
			<main>
				<div id="gauche">
					<h2>Formations</h2>
					<div id="bloc-bouton">
						<Button id="bouton-supp-tout" variant="secondary" size="sm" onClick={()=> this.props.onDeleteAll()}>Supprimer tout</Button>
						<Button id="bouton-ajouter" variant="secondary" size="sm" onClick={()=> this.props.onClickAjouter()}>Ajouter</Button>
					</div>
					<ul>
						{
							this.props.data.map(aData => <li key={aData.type+" "+aData.niveau+" parcours "+aData.parcours}><span className="span-liste-formation">{aData.type+" "+aData.niveau+" parcours "+aData.parcours}</span><Button id={aData.type+" "+aData.niveau+" "+aData.parcours} className="bouton-supp" onClick={(e)=>this.props.onDelete(e)} variant="secondary" size="sm">X</Button></li>)
						}
					</ul>
					<p>Nombre de formations ajoutées : {this.props.data.length}</p>
				</div>
				<div id="droite">
					<h2>Année</h2>
					<div id="bloc-choix-annee">
						<div id="bloc-select-choix-annee">
							<select className="form-select form-select-lg mb-3" onChange={this.handleChangeAnneeD.bind(this)}>
								{
									this.props.annees.map((annee) => <option key={annee}>{annee}</option>)
								}
							</select>
							<select className="form-select form-select-lg mb-3" defaultValue={this.props.annees[this.props.annees.length-1]} onChange={this.handleChangeAnneeF.bind(this)}>
								{
									this.props.annees.map((annee) => <option key={annee}>{annee}</option>)
								}
							</select>
						</div>
						<span style={{color: 'red', display: this.state.message_choix_annee==="" ? 'none': 'block', textAlign: 'center', margin: 'auto'}}>{this.state.message_choix_annee}</span>
					</div>

					<h2>Effectifs</h2>
					<div id="bloc-effectifs">
						<div id="bloc-boutons-effectifs">
							<Button onClick={this.handleClickBar.bind(this)}><img src={iconBarChart} alt="Icone lien diagramme en baton" /></Button>
							<Button onClick={this.handleClickLine.bind(this)}><img src={iconLineGraph} alt="Icone lien graphique courbe" /></Button>
						</div>
						<div className="tab-content">
							
							<div style={{display: (this.state.bar_chart===true ? 'block':'none')}}>
								<MDBContainer id="bar">
									<Bar data={this.state.dataBar} options={this.state.dataBar.barChartOptions} />
								</MDBContainer>						
							</div>
							<div style={{display: (this.state.line_graph===true ? 'block':'none')}}>
								<MDBContainer id="line">
									<Line data={this.state.dataLine} options={{ responsive: true }} />
								</MDBContainer>				
							</div>
							<div className="tab-pane" id="courbe">
							</div>
						</div>
					</div>
				</div>
			</main>
		);

	}
}

export default Main;

