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
				willSurviveRidley : false,
				willSurviveMB : false,
				ammoNeedsRidley : [0,0,0,0,0,0,false],
				ammoNeedsMB : [0,0,0,0,0,0,false]
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
		let ammoNeedsMB;
	
		ammoNeedsRidley = this.computeDamage("ridley");
		ammoNeedsMB = this.computeDamage("mb");
		this.setState({
		    beamCombo: beamCombo,
			ammoNeedsRidley: ammoNeedsRidley,
			ammoNeedsMB: ammoNeedsMB,
			willSurviveRidley: ammoNeedsRidley[6],
			willSurviveMB: ammoNeedsMB[6]
			
		});
		
		
		//console.log(beamCombo);
	};
	
	handleAmmoInput(sinlgeAmmoCount, ammoType){
		let ammoCount;
		let ammoNeedsRidley;
		let ammoNeedsMB;
		
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
		ammoNeedsMB = this.computeDamage("mb");
		
		this.setState({
		    ammoCount: ammoCount,
			ammoNeedsRidley: ammoNeedsRidley,
			ammoNeedsMB: ammoNeedsMB,
			willSurviveRidley: ammoNeedsRidley[6],
			willSurviveMB: ammoNeedsMB[6]
		});

	};
	
	handleSliderInput(singleSliderValue, enemy, weapon){
		let newValues;
		let ammoNeedsRidley;
		let ammoNeedsMB;
		
		if(enemy == "ridley" && weapon == "none"){
			newValues = [singleSliderValue, this.state.sliderValues[1], this.state.sliderValues[2], this.state.sliderValues[3], this.state.sliderValues[4]];
		} else if(enemy == "ridley" && weapon == "PB"){
			newValues = [this.state.sliderValues[0], singleSliderValue, this.state.sliderValues[2], this.state.sliderValues[3], this.state.sliderValues[4]];
		} else if(enemy == "ridley" && weapon == "X-Factor"){
			newValues = [this.state.sliderValues[0], this.state.sliderValues[1], singleSliderValue, this.state.sliderValues[3], this.state.sliderValues[4]];
		} else if (enemy == "mb" && weapon == "none"){
			newValues = [this.state.sliderValues[0], this.state.sliderValues[1], this.state.sliderValues[2], singleSliderValue, this.state.sliderValues[4]];
		} else {
			newValues = [this.state.sliderValues[0], this.state.sliderValues[1], this.state.sliderValues[2], this.state.sliderValues[3], this.state.sliderValues[4]];
			console.log("slider input error");
		}

		ammoNeedsRidley = this.computeDamage("ridley");
		ammoNeedsMB = this.computeDamage("mb");
		
		this.setState({
		    sliderValues: newValues,
			ammoNeedsRidley: ammoNeedsRidley,
			ammoNeedsMB: ammoNeedsMB,
			willSurviveRidley: ammoNeedsRidley[6],
			willSurviveMB: ammoNeedsMB[6]			
		});
	};
	
	handleCheckboxInput(singleCheckbox, weapon){
		let newValues;
		let ammoNeedsRidley;
		let ammoNeedsMB;
		
		if(weapon == "PB"){
			 newValues = [singleCheckbox, this.state.checkboxValues[1]];
		} else if (weapon == "X-Factor"){
			 newValues = [this.state.checkboxValues[0], singleCheckbox];
		} else {
			 newValues = [this.state.checkboxValues[0], this.state.checkboxValues[1]];
			console.log("checkbox input error");
		}
		
		ammoNeedsRidley = this.computeDamage("ridley");
		ammoNeedsMB = this.computeDamage("mb");
		
		this.setState({
		    checkboxValues: newValues,
			ammoNeedsRidley: ammoNeedsRidley,
			ammoNeedsMB: ammoNeedsMB,
			willSurviveRidley: ammoNeedsRidley[6],
			willSurviveMB: ammoNeedsMB[6]
		});
	};
	
	
	computeDamage(enemy){
		// decide which enemy you're fighting against
		let boss;
		let ammoNeedsRidley;
		let ammoNeedsMB;
		let willSurviveRidley;
		let willSurviveMB;
		let glassAmmo = [0,0];
		let missileDamage = 100;
		let supersDamage = 300;
		let pbsDamage = 200;
		let xfactorDamage = 1200;
		let myMissiles = this.state.ammoCount[0];
		let mySupers = this.state.ammoCount[1];
		let myPBs = this.state.ammoCount[2];
		let missileSuperSlider = this.state.sliderValues[3];
		let haveCharge = this.state.beamCombo[0];
		
		//console.log(enemy);
		if(enemy == "ridley"){
			boss = 18000;
			var super_multiplier = 2;
			var myDamageOutput = ((myMissiles*missileDamage)+(mySupers*supersDamage*super_multiplier));	
			if(this.state.checkboxValues[0] == 1){
				myDamageOutput += (400*myPBs);
			}
			if(this.state.checkboxValues[1] == 1){
				myDamageOutput += (1200*myPBs);
			}
				
			if(haveCharge == 1 || myDamageOutput>=boss){
				willSurviveRidley = true;
			}
			ammoNeedsRidley = [0,0,0,0,0,0,willSurviveRidley];
			return ammoNeedsRidley;
		} else if (enemy == "mb"){
			// this is mb1 + mb2 since you have to do the two together
			boss = 21000;
			
			// Account for the 6 shots needed to break the glass
			var extraShots = 6;
			var adjustedMissiles;
			var adjustedSupers;
			
			if(myMissiles >= 6){
				adjustedMissiles = myMissiles-6;
			} else if (myMissiles<=0) {
				if(mySupers>=6){
					adjustedSupers = mySupers-6;
				}
			} else if(myMissiles<6 && myMissiles>0) {
				var supersRemainder = 6-myMissiles;
				adjustedMissiles = 0;
				adjustedSupers = mySupers-supersRemainder;
			} else {
				console.log("mb calculation error");
			}
			
			var myDamageOutput = ((adjustedMissiles*missileDamage)+(adjustedSupers*supersDamage));	
			// no charge
			if(myDamageOutput>=boss){
				willSurviveMB = true;
			}
			
			ammoNeedsMB = [0,0,0,0,0,0,willSurviveMB];
			return ammoNeedsMB;
		} else {
			boss = 1;
			// missiles, supers, charged, pbs, xfacts, willSurvive
			ammoNeedsRidley = [0,0,0,0,0,0,false];
			ammoNeedsMB = [0,0,0,0,0,0,false];
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
					ammoNeedsMB={this.state.ammoNeedsMB} 
					willSurviveRidley={this.state.willSurviveRidley} 
					willSurviveMB={this.state.willSurviveMB} 
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
					willSurviveRidley={this.state.willSurviveRidley} 
					willSurviveMB={this.state.willSurviveMB}
					ammoNeedsRidley={this.state.ammoNeedsRidley}
					ammoNeedsMB={this.state.ammoNeedsMB}
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
					ammoNeedsMB={this.props.ammoNeedsMB} 
					willSurviveRidley={this.props.willSurviveRidley} 
					willSurviveMB={this.props.willSurviveMB}
				 />
				<BeamInput 
					beamCombo={this.props.beamCombo} 
		          	onToggleBeam={this.props.onToggleBeam}
					ammoNeedsRidley={this.props.ammoNeedsRidley}
					ammoNeedsMB={this.props.ammoNeedsMB} 
					willSurviveRidley={this.props.willSurviveRidley} 
					willSurviveMB={this.props.willSurviveMB}
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
					ammoNeedsMB={this.props.ammoNeedsMB}
					willSurviveRidley={this.props.willSurviveRidley} 
					willSurviveMB={this.props.willSurviveMB}
				 />
				<AmmoInputBox 
					name="Supers" 
					class="supers" 
					ammoCount={this.props.ammoCount} 
					onAmmoInput={this.props.onAmmoInput} 
					ammoNeedsRidley={this.props.ammoNeedsRidley}
					ammoNeedsMB={this.props.ammoNeedsMB}
					willSurviveRidley={this.props.willSurviveRidley} 
					willSurviveMB={this.props.willSurviveMB}
				 />
				<AmmoInputBox 
					name="PBs" 
					class="pbs"
					ammoCount={this.props.ammoCount} 
					onAmmoInput={this.props.onAmmoInput} 
					ammoNeedsRidley={this.props.ammoNeedsRidley}
					ammoNeedsMB={this.props.ammoNeedsMB} 
					willSurviveRidley={this.props.willSurviveRidley} 
					willSurviveMB={this.props.willSurviveMB}
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
					willSurviveRidley={this.props.willSurviveRidley} 
					willSurviveMB={this.props.willSurviveMB} 
					ammoNeedsRidley={this.props.ammoNeedsRidley} 
					ammoNeedsMB={this.props.ammoNeedsMB}
				 />
				<ResultsContainer 
					name="MB" 
					class="mb" 
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount} 
					sliderValues={this.props.sliderValues} 
					checkboxValues={this.props.checkboxValues} 
		          	onToggleBeam={this.props.onToggleBeam} 
					onAmmoInput={this.props.onAmmoInput} 
					onSliderInput={this.props.onSliderInput} 
					onCheckboxInput={this.props.onCheckboxInput} 
					willSurviveRidley={this.props.willSurviveRidley} 
					willSurviveMB={this.props.willSurviveMB} 
					ammoNeedsRidley={this.props.ammoNeedsRidley} 
					ammoNeedsMB={this.props.ammoNeedsMB}
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
				willSurviveRidley={this.props.willSurviveRidley} 
				willSurviveMB={this.props.willSurviveMB}  
				ammoNeedsRidley={this.props.ammoNeedsRidley}
				ammoNeedsMB={this.props.ammoNeedsMB} 
			 />
		);
		
		let surviveEnemy;
		if(this.props.class == "ridley"){
			surviveEnemy = this.props.willSurviveRidley; 
		} else if (this.props.class == "mb"){
			surviveEnemy = this.props.willSurviveMB;
		} else {
			surviveEnemy = false;
			console.log("survive enemy error");
		}
				
		return (
			<div className={container_classes}>
				<DeathBanner name={this.props.name} class={this.props.class} willSurvive={surviveEnemy} />
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
					willSurviveRidley={this.props.willSurviveRidley} 
					willSurviveMB={this.props.willSurviveMB}  
					ammoNeedsRidley={this.props.ammoNeedsRidley}
					ammoNeedsMB={this.props.ammoNeedsMB}
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
						willSurviveRidley={this.props.willSurviveRidley} 
						willSurviveMB={this.props.willSurviveMB}
					 />
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
						willSurviveRidley={this.props.willSurviveRidley} 
						willSurviveMB={this.props.willSurviveMB}
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
						willSurviveRidley={this.props.willSurviveRidley} 
						willSurviveMB={this.props.willSurviveMB}
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
						willSurviveRidley={this.props.willSurviveRidley} 
						willSurviveMB={this.props.willSurviveMB}
					 />
				</div>
			);
		} else if (this.props.class == "mb"){
			attack_choices = (
				<div>
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
					willSurviveRidley={this.props.willSurviveRidley} 
					willSurviveMB={this.props.willSurviveMB}
				 />
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
					willSurviveRidley={this.props.willSurviveRidley} 
					willSurviveMB={this.props.willSurviveMB}
				 />
				</div>
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
		} else if(this.props.class == "mb"){
			missile_totals = (
				<li className="missiles"><span className="number">{this.props.ammoNeedsMB[0]}</span> Missiles</li>
			);
			super_totals = (
				<li className="supers"><span className="number">{this.props.ammoNeedsMB[1]}</span> Supers</li>	
			);
			charged_shots_work = (
				<li className="charged_shots"><span className="numbers">{"NUMBER"}</span> Charged Shots</li>	
			);
			pbs_work = "";
			xfactors_work = "";
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
	if (enemy == "mb"){
		weapons = ["missiles", "supers", "charged_shots"];
	} else {
		weapons = ["missiles", "supers", "charged_shots", "pbs", "xfactors"];
	}
	return weapons;
}





//======================================================================



export default App;
