//import logo from './logo.svg';
//import './App.css';
import React from 'react';
//import ReactDOM from 'react-dom';

//import jsondata from './sm_damage.json';

//var my_beams = [0,0,0,0,0];

function App() {
	return (
		<div className="App">
			<header className="app_header">
				<h1>Super Metroid Damage Calculator</h1>
			</header>
			
			<DamageCalculator />
			
		</div>
	);
}

class DamageCalculator extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				beamCombo: [0,0,0,0,0],
				ammoCount: [0,0,0],
				sliderValues: [0,0,0,0,0],
				checkboxValues: [0,0],
				willSurvive : false,
				ammoNeedsRidley : [0,0,0,0,0,0,false],
				ammoNeedsMB1 : [0,0,0,0,0,0,false],
				ammoNeedsMB2 : [0,0,0,0,0,0,false]
			};
			
			this.handleToggleBeam = this.handleToggleBeam.bind(this);
			this.handleAmmoInput = this.handleAmmoInput.bind(this);
			this.handleSliderInput = this.handleSliderInput.bind(this);
			this.handleCheckboxInput = this.handleCheckboxInput.bind(this);
			this.handleCheckboxInput = this.handleCheckboxInput.bind(this);
			this.computeDamage = this.computeDamage.bind(this);
		}
	handleToggleBeam(beamCombo) {
		let ammoNeedsRidley;
		let ammoNeedsMB1;
		let ammoNeedsMB2;
	
		ammoNeedsRidley = this.computeDamage("ridley");
		ammoNeedsMB1 = this.computeDamage("mb1");
		ammoNeedsMB2 = this.computeDamage("mb2");
		this.setState({
		    beamCombo: beamCombo,
			ammoNeedsRidley: ammoNeedsRidley,
			ammoNeedsMB1: ammoNeedsMB1,
			ammoNeedsMB2: ammoNeedsMB2
			
		});
		
		
		//console.log(beamCombo);
	};
	
	handleAmmoInput(sinlgeAmmoCount, ammoType){
		let ammoCount;
		let ammoNeedsRidley;
		let ammoNeedsMB1;
		let ammoNeedsMB2;
		
		if(ammoType == "missiles"){
			ammoCount = [sinlgeAmmoCount, this.state.ammoCount[1], this.state.ammoCount[2]];
		} else if (ammoType == "supers"){
			ammoCount = [this.state.ammoCount[0], sinlgeAmmoCount, this.state.ammoCount[2]];
		} else if (ammoType == "pbs"){
			ammoCount = [this.state.ammoCount[0], this.state.ammoCount[1], sinlgeAmmoCount];
		} else {
			ammoCount = [0,0,0];
		}
		//console.log(enemy);
		
		ammoNeedsRidley = this.computeDamage("ridley");
		ammoNeedsMB1 = this.computeDamage("mb1");
		ammoNeedsMB2 = this.computeDamage("mb2");
		
		this.setState({
		    ammoCount: ammoCount,
			ammoNeedsRidley: ammoNeedsRidley,
			ammoNeedsMB1: ammoNeedsMB1,
			ammoNeedsMB2: ammoNeedsMB2
			
		});

	};
	
	handleSliderInput(singleSliderValue, enemy, weapon){
		let newValues;
		let ammoNeedsRidley;
		let ammoNeedsMB1;
		let ammoNeedsMB2;
		
		if(enemy == "ridley" && weapon == "none"){
			newValues = [singleSliderValue, this.state.sliderValues[1], this.state.sliderValues[2], this.state.sliderValues[3], this.state.sliderValues[4]];
		} else if(enemy == "ridley" && weapon == "PB"){
			newValues = [this.state.sliderValues[0], singleSliderValue, this.state.sliderValues[2], this.state.sliderValues[3], this.state.sliderValues[4]];
		} else if(enemy == "ridley" && weapon == "X-Factor"){
			newValues = [this.state.sliderValues[0], this.state.sliderValues[1], singleSliderValue, this.state.sliderValues[3], this.state.sliderValues[4]];
		} else if (enemy == "mb1" && weapon == "none"){
			newValues = [this.state.sliderValues[0], this.state.sliderValues[1], this.state.sliderValues[2], singleSliderValue, this.state.sliderValues[4]];
		} else if(enemy == "mb2" && weapon == "none"){
			newValues = [this.state.sliderValues[0], this.state.sliderValues[1], this.state.sliderValues[2], this.state.sliderValues[3], singleSliderValue];
		} else {
			newValues = [this.state.sliderValues[0], this.state.sliderValues[1], this.state.sliderValues[2], this.state.sliderValues[3], this.state.sliderValues[4]];
			console.log("slider input error");
		}

		ammoNeedsRidley = this.computeDamage("ridley");
		ammoNeedsMB1 = this.computeDamage("mb1");
		ammoNeedsMB2 = this.computeDamage("mb2");
		
		this.setState({
		    sliderValues: newValues,
			ammoNeedsRidley: ammoNeedsRidley,
			ammoNeedsMB1: ammoNeedsMB1,
			ammoNeedsMB2: ammoNeedsMB2
			
		});
	};
	
	handleCheckboxInput(singleCheckbox, weapon){
		let newValues;
		let ammoNeedsRidley;
		let ammoNeedsMB1;
		let ammoNeedsMB2;
		
		if(weapon == "PB"){
			 newValues = [singleCheckbox, this.state.checkboxValues[1]];
		} else if (weapon == "X-Factor"){
			 newValues = [this.state.checkboxValues[0], singleCheckbox];
		} else {
			 newValues = [this.state.checkboxValues[0], this.state.checkboxValues[1]];
			console.log("checkbox input error");
		}
		
		this.setState({
		    checkboxValues: newValues,
			ammoNeedsRidley: ammoNeedsRidley,
			ammoNeedsMB1: ammoNeedsMB1,
			ammoNeedsMB2: ammoNeedsMB2
			
		});
	};
	
	// updateMasterData(beams, ammo, sliders, checkbox){
	// 	this.state.beamCombo = beams;
	// 	this.state.ammoCount = ammo;
	// 	this.state.sliderValues = sliders;
	// 	this.state.checkboxValues = checkbox;
	// }
	// 
	
	computeDamage(enemy){
		// decide which enemy you're fighting against
		let boss;
		let ammoNeedsRidley;
		let ammoNeedsMB1;
		let ammoNeedsMB2;
		let willSurvive = false;
		let glassAmmo = [0,0];
		let missileDamage = 100;
		let supersDamage = 300;
		let myMissiles = this.state.ammoCount[0];
		let mySupers = this.state.ammoCount[1];
		let missileSuperSlider = this.state.sliderValues[3];
		
		//console.log(enemy);
		if(enemy == "ridley"){
			boss = 18000;
			var super_multiplier = 2;
			ammoNeedsRidley = [0,0,0,0,0, false];
			return ammoNeedsRidley;
		} else if (enemy == "mb1"){
			boss = 3000;
			var extraShots = 6;
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			// breaking the glass requires 6 shots of either missiles or supers, but preferring missiles for the logic
			if(myMissiles>=extraShots){
				myMissiles -= extraShots;
				glassAmmo[0] = extraShots;
				console.log("b1");
			} else if (myMissiles<=0){
				if(mySupers>=extraShots){
					mySupers -= extraShots;
					glassAmmo[1] = extraShots;
					console.log("b2a");
				} else {
					console.log("b2b");
					// you don't have enough ammo, return death data
					ammoNeedsMB1 = this.state.ammoNeedsMB1;
					return ammoNeedsMB1;
				}
			} else {
				console.log("b3");
				var extraSupers = extraShots-myMissiles;
				mySupers -= extraSupers
				glassAmmo[0] = myMissiles;
				glassAmmo[1] = extraSupers;
			}

			if(supersDamage*mySupers + missileDamage*myMissiles >= boss){
				// you live
				
				console.log("b4");
				var maxSupers = Math.ceil(boss/supersDamage);
				var maxMissiles = Math.ceil(boss/missileDamage);
				console.log(maxSupers);
				console.log(maxMissiles);
				var missileProp = Math.round((maxMissiles*missileSuperSlider));
				var superProp = Math.round((maxSupers*(1-missileSuperSlider)));
				var ammoProp = [superProp, missileProp];
				ammoNeedsMB1 = [missileProp, superProp, 0,0,0, true];
				return ammoNeedsMB1;


			} else {
				console.log("b5");
				// you die, return death data
				ammoNeedsMB1 = this.state.ammoNeedsMB1;
				return ammoNeedsMB1;
			}


		} else if (enemy == "mb2"){
			boss = 18000;
			ammoNeedsMB2 = [0,0,0,0,0, false];
			return ammoNeedsMB2;
		} else {
			boss = 1;
			// missiles, supers, charged, pbs, xfacts, willSurvive
			ammoNeedsRidley = [0,0,0,0,0, false];
			ammoNeedsMB1 = [0,0,0,0,0, false];
			ammoNeedsMB2 = [0,0,0,0,0, false];
			console.log("compute damage error");
		}
		// var vulnerable_to = whatWeapons(enemy);

		// what are the slider values?
		// how many of each type is needed
		// return NUMBER per WEAPON
	}
	
	render(){
		
		return (
			<div className="damage_calculator">
				<PlayerInput
					beamCombo={this.state.beamCombo} 
					ammoCount={this.state.ammoCount} 
		          	onToggleBeam={this.handleToggleBeam} 
					onAmmoInput={this.handleAmmoInput} 
					ammoNeedsRidley={this.state.ammoNeedsRidley}
					ammoNeedsMB1={this.state.ammoNeedsMB1}
					ammoNeedsMB2={this.state.ammoNeedsMB2} 
					willSurvive={this.state.willSurvive}
				 />
				<DamageResults
					beamCombo={this.state.beamCombo} 
					ammoCount={this.state.ammoCount} 
					sliderValues={this.state.sliderValues} 
					checkboxValues={this.state.checkboxValues}
		          	onToggleBeam={this.handleToggleBeam} 
					onAmmoInput={this.handleAmmoInput} 
					onSliderInput={this.handleSliderInput} 
					onCheckboxInput={this.handleCheckboxInput} 
					willSurvive={this.state.willSurvive} 
					ammoNeedsRidley={this.state.ammoNeedsRidley}
					ammoNeedsMB1={this.state.ammoNeedsMB1}
					ammoNeedsMB2={this.state.ammoNeedsMB2}
				 />
			</div>
		);
	}
}

class PlayerInput extends React.Component {
	render(){
		
		return (
			<div className="player_input">
				<AmmoInput 
					ammoCount={this.props.ammoCount} 
					onAmmoInput={this.props.onAmmoInput} 
					ammoNeedsRidley={this.props.ammoNeedsRidley}
					ammoNeedsMB1={this.props.ammoNeedsMB1}
					ammoNeedsMB2={this.props.ammoNeedsMB2} 
					willSurvive={this.props.willSurvive}
				 />
				<BeamInput 
					beamCombo={this.props.beamCombo} 
		          	onToggleBeam={this.props.onToggleBeam}
					ammoNeedsRidley={this.props.ammoNeedsRidley}
					ammoNeedsMB1={this.props.ammoNeedsMB1}
					ammoNeedsMB2={this.props.ammoNeedsMB2} 
					willSurvive={this.props.willSurvive}
				 />
			</div>
		);
	}
}

class AmmoInput extends React.Component {
	render(){
		
		return (
			<div className="ammo_input">
				<AmmoInputBox 
					name="Missiles" 
					class="missiles" 
					ammoCount={this.props.ammoCount} 
					onAmmoInput={this.props.onAmmoInput} 
					ammoNeedsRidley={this.props.ammoNeedsRidley}
					ammoNeedsMB1={this.props.ammoNeedsMB1}
					ammoNeedsMB2={this.props.ammoNeedsMB2} 
					willSurvive={this.props.willSurvive}
				 />
				<AmmoInputBox 
					name="Supers" 
					class="supers" 
					ammoCount={this.props.ammoCount} 
					onAmmoInput={this.props.onAmmoInput} 
					ammoNeedsRidley={this.props.ammoNeedsRidley}
					ammoNeedsMB1={this.props.ammoNeedsMB1}
					ammoNeedsMB2={this.props.ammoNeedsMB2} 
					willSurvive={this.props.willSurvive}
				 />
				<AmmoInputBox 
					name="PBs" 
					class="pbs"
					ammoCount={this.props.ammoCount} 
					onAmmoInput={this.props.onAmmoInput} 
					ammoNeedsRidley={this.props.ammoNeedsRidley}
					ammoNeedsMB1={this.props.ammoNeedsMB1}
					ammoNeedsMB2={this.props.ammoNeedsMB2} 
					willSurvive={this.props.willSurvive}
					 />
			</div>
		);
	}
}


class BeamInput extends React.Component {
	render(){
		
		let newClasses = ["","","","",""];
		for(var i=0; i<this.props.beamCombo.length; i++){
			if(this.props.beamCombo[i]){
				newClasses[i] = " selected";
			} else {
				newClasses[i] = "";
			}
		}
		return (
			<ul className="beam_input">
				<ToggleBeam 
					name="Charge" 
					class={"charge"+newClasses[0]} 
					beamCombo={this.props.beamCombo} 
		          	onToggleBeam={this.props.onToggleBeam}
				 />
				<ToggleBeam 
					name="Ice" 
					class={"ice"+newClasses[1]} 
					beamCombo={this.props.beamCombo} 
		          	onToggleBeam={this.props.onToggleBeam}
				 />
				<ToggleBeam 
					name="Spazer" 
					class={"spazer"+newClasses[2]} 
					beamCombo={this.props.beamCombo} 
		          	onToggleBeam={this.props.onToggleBeam}
				 />
				<ToggleBeam 
					name="Wave" 
					class={"wave"+newClasses[3]} 
					beamCombo={this.props.beamCombo} 
		          	onToggleBeam={this.props.onToggleBeam}
				 />
				<ToggleBeam 
					name="Plasma" 
					class={"plasma"+newClasses[4]} 
					beamCombo={this.props.beamCombo} 
		          	onToggleBeam={this.props.onToggleBeam}
				 />
			</ul>
		);
	}
}

class DamageResults extends React.Component {
	render(){
		return (
			<div className="damage_results">
				<ResultsContainer 
					name="Ridley" 
					class="ridley" 
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount} 
					sliderValues={this.props.sliderValues} 
					checkboxValues={this.props.checkboxValues}
		          	onToggleBeam={this.props.onToggleBeam} 
					onAmmoInput={this.props.onAmmoInput} 
					onSliderInput={this.props.onSliderInput} 
					onCheckboxInput={this.props.onCheckboxInput} 
					willSurvive={this.props.willSurvive} 
					ammoNeedsRidley={this.props.ammoNeedsRidley} 
					ammoNeedsMB1={this.props.ammoNeedsMB1} 
					ammoNeedsMB2={this.props.ammoNeedsMB2}
				 />
				<ResultsContainer 
					name="MB1" 
					class="mb1" 
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount} 
					sliderValues={this.props.sliderValues} 
					checkboxValues={this.props.checkboxValues}
		          	onToggleBeam={this.props.onToggleBeam} 
					onAmmoInput={this.props.onAmmoInput} 
					onSliderInput={this.props.onSliderInput} 
					onCheckboxInput={this.props.onCheckboxInput} 
					willSurvive={this.props.willSurvive} 
					ammoNeedsRidley={this.props.ammoNeedsRidley} 
					ammoNeedsMB1={this.props.ammoNeedsMB1} 
					ammoNeedsMB2={this.props.ammoNeedsMB2}
				 />
				<ResultsContainer 
					name="MB2" 
					class="mb2" 
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount} 
					sliderValues={this.props.sliderValues} 
					checkboxValues={this.props.checkboxValues}
		          	onToggleBeam={this.props.onToggleBeam} 
					onAmmoInput={this.props.onAmmoInput} 
					onSliderInput={this.props.onSliderInput} 
					onCheckboxInput={this.props.onCheckboxInput} 
					willSurvive={this.props.willSurvive} 
					ammoNeedsRidley={this.props.ammoNeedsRidley} 
					ammoNeedsMB1={this.props.ammoNeedsMB1} 
					ammoNeedsMB2={this.props.ammoNeedsMB2}
				 />
			</div>
		);
	}
}

class ResultsContainer extends React.Component {
	render(){
		let container_classes;
		let add_sliders;
		
		add_sliders = (
			<ResultsControls 
				name={this.props.name} 
				class={this.props.class}
				beamCombo={this.props.beamCombo} 
				ammoCount={this.props.ammoCount} 
				sliderValues={this.props.sliderValues} 
				checkboxValues={this.props.checkboxValues}
	          	onToggleBeam={this.props.onToggleBeam} 
				onAmmoInput={this.props.onAmmoInput} 
				onSliderInput={this.props.onSliderInput} 
				onCheckboxInput={this.props.onCheckboxInput} 
				willSurvive={this.props.willSurvive} 
				ammoNeedsRidley={this.props.ammoNeedsRidley}
				ammoNeedsMB1={this.props.ammoNeedsMB1}
				ammoNeedsMB2={this.props.ammoNeedsMB2}
			 />
		);
		
		//		let willSurvive;
		// if(this.props.class=="ridley"){
		// 	if(this.props.ammoNeedsRidley[6]){
		// 		container_classes = "results_container live";
		// 		willSurvive = true;
		// 	} else {
		// 		container_classes = "results_container die";
		// 		willSurvive = false;
		// 	}
		// } else if (this.props.class=="mb1"){
		// 	if(this.props.ammoNeedsMB1[6]){
		// 		container_classes = "results_container live";
		// 		willSurvive = true;
		// 	} else {
		// 		container_classes = "results_container die";
		// 		willSurvive = false;
		// 	}
		// } else if (this.props.class=="mb2"){
		// 	if(this.props.ammoNeedsMB2[6]){
		// 		container_classes = "results_container live";
		// 		willSurvive = true;
		// 	} else {
		// 		container_classes = "results_container die";
		// 		willSurvive = false;
		// 	}
		// } else {
		// 		container_classes = "results_container die";
		// 		willSurvive = false;
		// 		console.log("live die classes error");
		// }
		// 
		// if(this.props.willSurvive){
		// 	container_classes = "results_container live";
		// } else {
		// 	container_classes = "results_container die";
		// }
		// 
		console.log(this.props.willSurvive);
		
		return (
			<div className={container_classes}>
				<DeathBanner name={this.props.name} class={this.props.class} willSurvive={this.props.willSurvive} />
				{add_sliders}
				<ResultsData 
					name={this.props.name} 
					class={this.props.class}
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount} 
					sliderValues={this.props.sliderValues} 
					checkboxValues={this.props.checkboxValues}
		          	onToggleBeam={this.props.onToggleBeam} 
					onAmmoInput={this.props.onAmmoInput} 
					onSliderInput={this.props.onSliderInput} 
					onCheckboxInput={this.props.onCheckboxInput} 
					willSurvive={this.props.willSurvive} 
					ammoNeedsRidley={this.props.ammoNeedsRidley}
					ammoNeedsMB1={this.props.ammoNeedsMB1}
					ammoNeedsMB2={this.props.ammoNeedsMB2}
				 />
			</div>
		);
	}
	
}

class ResultsControls extends React.Component {
	render(){
		let attack_choices;
		if(this.props.class == "ridley"){
			attack_choices = (
				<div>
					<AmmoBeamChoice
						weapon="none" 
						name={this.props.name} 
						class={this.props.class} 
						beamCombo={this.props.beamCombo} 
						ammoCount={this.props.ammoCount} 
						sliderValues={this.props.sliderValues} 
						checkboxValues={this.props.checkboxValues}
			          	onToggleBeam={this.props.onToggleBeam} 
						onAmmoInput={this.props.onAmmoInput} 
						onSliderInput={this.props.onSliderInput} 
						onCheckboxInput={this.props.onCheckboxInput} 
						willSurvive={this.props.willSurvive}
					 />
					<ExtraAttackChoice 
						weapon="PB" 
						name={this.props.name} 
						class={this.props.class} 
						beamCombo={this.props.beamCombo} 
						ammoCount={this.props.ammoCount} 
						sliderValues={this.props.sliderValues} 
						checkboxValues={this.props.checkboxValues}
			          	onToggleBeam={this.props.onToggleBeam} 
						onAmmoInput={this.props.onAmmoInput} 
						onSliderInput={this.props.onSliderInput} 
						onCheckboxInput={this.props.onCheckboxInput} 
						willSurvive={this.props.willSurvive}
					 />
					<ExtraAttackChoice 
						weapon="X-Factor" 
						name={this.props.name} 
						class={this.props.class} 
						beamCombo={this.props.beamCombo} 
						ammoCount={this.props.ammoCount} 
						sliderValues={this.props.sliderValues} 
						checkboxValues={this.props.checkboxValues}
			          	onToggleBeam={this.props.onToggleBeam} 
						onAmmoInput={this.props.onAmmoInput} 
						onSliderInput={this.props.onSliderInput} 
						onCheckboxInput={this.props.onCheckboxInput} 
						willSurvive={this.props.willSurvive}
					 />
				</div>
			);
		} else if (this.props.class == "mb1"){
			attack_choices = (
				<MissilesSupersChoice 
				weapon="none" 
				name={this.props.name} 
				class={this.props.class} 
				beamCombo={this.props.beamCombo} 
				ammoCount={this.props.ammoCount} 
				sliderValues={this.props.sliderValues} 
				checkboxValues={this.props.checkboxValues}
	          	onToggleBeam={this.props.onToggleBeam} 
				onAmmoInput={this.props.onAmmoInput} 
				onSliderInput={this.props.onSliderInput} 
				onCheckboxInput={this.props.onCheckboxInput} 
				willSurvive={this.props.willSurvive}
				 />
			);
		} else {
			attack_choices = (
				<AmmoBeamChoice
					weapon="none" 
					name={this.props.name} 
					class={this.props.class} 
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount} 
					sliderValues={this.props.sliderValues} 
					checkboxValues={this.props.checkboxValues}
		          	onToggleBeam={this.props.onToggleBeam} 
					onAmmoInput={this.props.onAmmoInput} 
					onSliderInput={this.props.onSliderInput} 
					onCheckboxInput={this.props.onCheckboxInput} 
					willSurvive={this.props.willSurvive}
				 />
			);	
		}
		return (
			<div className="results_controls">
				{attack_choices}
			</div>
		);
	}
}



//======================================================================



class AmmoInputBox extends React.Component {
	constructor(props) {
		super(props);
		this.handleAmmoInput = this.handleAmmoInput.bind(this);
		
	}
	
	handleAmmoInput(e){
		this.props.onAmmoInput(e.target.value, this.props.class);
//		console.log(e);
	}

	render(){
		
		return (
			<div className={this.props.class + " ammo_input_box"}>
            	<label>{this.props.name}</label>
            	<input type="number" defaultValue="0" min="0" max="999" onChange={this.handleAmmoInput.bind(this)} />
        	</div>
		);
	}
}

class ToggleBeam extends React.Component {
	constructor(props) {
		super(props);
		this.handleToggleBeam = this.handleToggleBeam.bind(this);
	}
		
	handleToggleBeam(e){
		let beamIndex;
		let singleBeamValue;
		let newCombo;
		
		
		if(this.props.class == "charge" || this.props.class == "charge selected"){
			beamIndex = 0;
			singleBeamValue = (this.props.beamCombo[beamIndex]==1 ? 0 : 1);
			newCombo = [singleBeamValue, this.props.beamCombo[1], this.props.beamCombo[2], this.props.beamCombo[3], this.props.beamCombo[4]];
		} else if (this.props.class == "ice" || this.props.class == "ice selected"){
			beamIndex = 1;
			singleBeamValue = (this.props.beamCombo[beamIndex]==1 ? 0 : 1);
			newCombo = [this.props.beamCombo[0], singleBeamValue, this.props.beamCombo[2], this.props.beamCombo[3], this.props.beamCombo[4]];
		} else if (this.props.class == "spazer" || this.props.class == "spazer selected"){
			beamIndex = 2;
			singleBeamValue = (this.props.beamCombo[beamIndex]==1 ? 0 : 1);
			if(singleBeamValue == "1"){
				newCombo = [this.props.beamCombo[0], this.props.beamCombo[1], singleBeamValue, this.props.beamCombo[3], 0];
			} else {
				newCombo = [this.props.beamCombo[0], this.props.beamCombo[1], singleBeamValue, this.props.beamCombo[3], this.props.beamCombo[4]];
			}
		} else if (this.props.class == "wave" || this.props.class == "wave selected"){
			beamIndex = 3;
			singleBeamValue = (this.props.beamCombo[beamIndex]==1 ? 0 : 1);
			newCombo = [this.props.beamCombo[0], this.props.beamCombo[1], this.props.beamCombo[2], singleBeamValue, this.props.beamCombo[4]];
		} else if (this.props.class == "plasma" || this.props.class == "plasma selected"){
			beamIndex = 4;
			singleBeamValue = (this.props.beamCombo[beamIndex]==1 ? 0 : 1);
			if(singleBeamValue == "1"){
				newCombo = [this.props.beamCombo[0], this.props.beamCombo[1], 0, this.props.beamCombo[3], singleBeamValue];
			} else {
				newCombo = [this.props.beamCombo[0], this.props.beamCombo[1], this.props.beamCombo[2], this.props.beamCombo[3], singleBeamValue];
			}
		} else {
			console.log("error beam input");
			beamIndex = -1;
			singleBeamValue = (this.props.beamCombo[beamIndex]==1 ? 0 : 1);
			newCombo = [0,0,0,0,0];
		}
		this.props.onToggleBeam(newCombo);
	}
	
	render(){
//		console.log(this.newClassName);
		return (
			<li className={this.props.class}>
				<button  onClick={this.handleToggleBeam.bind(this)} type="button">{this.props.name}</button>
			</li>
		);
	}
}

class DeathBanner extends React.Component {
	render(){
		let banner_message;
		if(this.props.willSurvive){
			banner_message = (<h2 className="you_live">YOU ARE ALL SET...</h2>);
		} else {
			banner_message = (<h2 className="you_die">YOU ARE GOING TO DIE...</h2>);
		}
		return (
			<div className="death_banner">
				{banner_message}
			</div>
		);
	}
}
			
class AmmoBeamChoice extends React.Component {
	constructor(props) {
		super(props);
		this.handleSliderInput = this.handleSliderInput.bind(this);
	}
	
		handleSliderInput(e){
			this.props.onSliderInput(e.target.value, this.props.class, this.props.weapon);
		}
	
	render(){
		
		return (
			<div className="ammo_beam_choice">
				<div>
					<h3>Would you like to use more AMMO or BEAMS?</h3>
					<form>
						<span>AMMO</span> <input type="range" min="0" max="1" step="0.01" defaultValue="0" onChange={this.handleSliderInput.bind(this)} /> <span>BEAMS</span>
					</form>
				</div>
			</div>
		);
	}
}

class MissilesSupersChoice extends React.Component {
	constructor(props) {
		super(props);
		this.handleSliderInput = this.handleSliderInput.bind(this);
	}
	
		handleSliderInput(e){
			this.props.onSliderInput(e.target.value, this.props.class, this.props.weapon);
		}
	
	render(){
		let maxSupers = this.props.ammoCount[1];
		return (
			<div className="missiles_supers_choice">
				<div>
					<h3>Would you like to use more SUPERS or MISSILES?</h3>
					<form>
						<span>SUPERS</span> <input type="range" min="0" max={maxSupers} step="1" defaultValue="0" onChange={this.handleSliderInput.bind(this)} /> <span>MISSILES</span>
					</form>
				</div>
			</div>
		);
	}
}


class ExtraAttackChoice extends React.Component {
	constructor(props) {
		super(props);
		this.handleCheckboxInput = this.handleCheckboxInput.bind(this);
	}
	
	handleCheckboxInput(e){
		let singleValue = (e.target.checked ? 1 : 0)
		this.props.onCheckboxInput(singleValue, this.props.weapon);
	}
	
	handleSliderInput(e){
		this.props.onSliderInput(e.target.value, this.props.class, this.props.weapon);
	}

	render(){
		let maxPBs = this.props.ammoCount[2];
		
		return (
			<div className="extra_attack_choice">
				<form>
					<input type="checkbox" onChange={this.handleCheckboxInput.bind(this)} /> <span>Would you like to use {this.props.weapon}s against Ridley?</span>
					<div>
						<span>0</span> <input type="range" min="0" max={maxPBs} step="1" defaultValue="0" onChange={this.handleSliderInput.bind(this)} /> <span>MAX</span>
					</div>
				</form>
			</div>
		);
	}
}

class ResultsData extends React.Component {
	
	render(){
		let pbs_work;
		let xfactors_work;
		let charged_shots_work;
		let missile_totals;
		let super_totals;

		if (this.props.class == "ridley"){
			missile_totals = (
				<li className="missiles"><span className="number">{this.props.ammoNeedsRidley[0]}</span> Missiles</li>
			);
			super_totals = (
				<li className="supers"><span className="number">{this.props.ammoNeedsRidley[1]}</span> Supers</li>	
			);
			charged_shots_work = (
				<li className="charged_shots"><span className="numbers">{"NUMBER"}</span> Charged Shots</li>	
			);
			pbs_work = (
				<li className="pbs"><span className="number">{"NUMBER"}</span> PBs</li>
			);
			xfactors_work = (
				<li className="xfactor"><span className="number">{"NUMBER"}</span> X-Factors</li>
			);
		} else if(this.props.class == "mb2"){
			missile_totals = (
				<li className="missiles"><span className="number">{this.props.ammoNeedsMB2[0]}</span> Missiles</li>
			);
			super_totals = (
				<li className="supers"><span className="number">{this.props.ammoNeedsMB2[1]}</span> Supers</li>	
			);
			charged_shots_work = (
				<li className="charged_shots"><span className="numbers">{"NUMBER"}</span> Charged Shots</li>	
			);
			pbs_work = "";
			xfactors_work = "";
		} else if(this.props.class == "mb1") {
			console.log(this.props);
			missile_totals = (
				<li className="missiles"><span className="number">{this.props.ammoNeedsMB1[0]}</span> Missiles</li>
			);
			super_totals = (
				<li className="supers"><span className="number">{this.props.ammoNeedsMB1[1]}</span> Supers</li>	
			);
			pbs_work = "";
			xfactors_work = "";
			charged_shots_work = "";
		}
		//console.log(this.props.ammoNeeds);
		return (
			<div className={this.props.class + " results_data"}>
				<h3>You can kill {this.props.name} with...</h3>
				<ul>
					{missile_totals}
					{super_totals}
					{pbs_work}
					{xfactors_work}
					{charged_shots_work}
				</ul>
			</div>
		);
	}
}



//======================================================================


function whatWeapons(enemy){
	var weapons = [];
	if(enemy == "mb1"){
		weapons = ["missiles", "supers"];
	} else if (enemy == "mb2"){
		weapons = ["missiles", "supers", "charged_shots"];
	} else {
		weapons = ["missiles", "supers", "charged_shots", "pbs", "xfactors"];
	}
	return weapons;
}





//======================================================================



export default App;
