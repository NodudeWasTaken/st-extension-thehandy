import { regulateSpeed } from "./utils.js";

export const aichat_cmd = [{
	command: /gentlePat\(\)/,
		func: async (match,handy) => {
			var minr = 10, maxr = 20, vel = 10;
			vel = regulateSpeed(vel)
			console.log(match, minr, maxr, vel)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			await handy.setHampVelocity(vel)
		}
	},
	{
		command: /gentleStroke\(\)/,
		func: async (match,handy) => {
			var minr = 20, maxr = 50, vel = 10;
			vel = regulateSpeed(vel)
			console.log(match, minr, maxr, vel)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			await handy.setHampVelocity(vel)
		}
	},
	{
		command: /firmGrip\(\)/,
		func: async (match,handy) => {
			var minr = 10, maxr = 30, vel = 20;
			vel = regulateSpeed(vel)
			console.log(match, minr, maxr, vel)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			await handy.setHampVelocity(vel)
		}
	},
	{
		command: /deny\(\)/,
		func: async (match,handy) => {
			var minr = 100, maxr = 100;
			console.log(match, minr, maxr)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			setTimeout(() => {
				handy.setHampStop().then(() => {
					running = false
				})
			}, 500);
		}
	},
	{
		command: /rapidHeadStroke\(\)/,
		func: async (match,handy) => {
			var minr = 90, maxr = 100, vel = 10;
			vel = regulateSpeed(vel)
			console.log(match, minr, maxr)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			await handy.setHampVelocity(vel)
		}
	},
	{
		command: /mouthCommand\(\)/,
		func: async (match,handy) => {
			var minr = 40, maxr = 100, vel = 10;
			vel = regulateSpeed(vel)
			console.log(match, minr, maxr)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			await handy.setHampVelocity(vel)
		}
	},
	{
		command: /threateningGrip\(\)/,
		func: async (match,handy) => {
			var minr = 10, maxr = 20, vel = 25;
			vel = regulateSpeed(vel)
			console.log(match, minr, maxr)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			await handy.setHampVelocity(vel)
		}
	},
	{
		command: /ultimateDrain\(\)/,
		func: async (match,handy) => {
			var minr = 10, maxr = 100, vel = 35;
			vel = regulateSpeed(vel)
			console.log(match, minr, maxr)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			await handy.setHampVelocity(vel)
		}
	},
	{
		command: /soothingTouch\(\)/,
		func: async (match,handy) => {
			var minr = 10, maxr = 60, vel = 5;
			vel = regulateSpeed(vel)
			console.log(match, minr, maxr)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			await handy.setHampVelocity(vel)
		}
	},
	{
		command: /punishPulse\(\)/,
		func: async (match,handy) => {
			var minr = 80, maxr = 100, vel = 25;
			vel = regulateSpeed(vel)
			console.log(match, minr, maxr)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			await handy.setHampVelocity(vel)
		}
	},
	{
		command: /slowAgonyStroke\(\)/,
		func: async (match,handy) => {
			var minr = 20, maxr = 80, vel = 5;
			vel = regulateSpeed(vel)
			console.log(match, minr, maxr)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			await handy.setHampVelocity(vel)
		}
	},
	{
		command: /baseGrip\(\)/,
		func: async (match,handy) => {
			var minr = 0, maxr = 5, vel = 15;
			vel = regulateSpeed(vel)
			console.log(match, minr, maxr)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			await handy.setHampVelocity(vel)
		}
	},
	{
		command: /initialSeizure\(\)/,
		func: async (match,handy) => {
			var minr = 10, maxr = 40, vel = 10;
			vel = regulateSpeed(vel)
			console.log(match, minr, maxr)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			await handy.setHampVelocity(vel)
		}
	},
	{
		command: /relentlessStroke\(\)/,
		func: async (match,handy) => {
			var minr = 5, maxr = 60, vel = 20;
			vel = regulateSpeed(vel)
			console.log(match, minr, maxr)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			await handy.setHampVelocity(vel)
		}
	},
	{
		command: /punishingSqueeze\(\)/,
		func: async (match,handy) => {
			var minr = 0, maxr = 10, vel = 30;
			vel = regulateSpeed(vel)
			console.log(match, minr, maxr)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
			await handy.setHampVelocity(vel)
		}
	},
	{
		command: /stop\(\)/,
		func: async (match,handy) => {
			console.log(match)
			setTimeout(() => {
				handy.setHampStop().then(() => {
					running = false
				})
			}, 500);
		}
	},
]
