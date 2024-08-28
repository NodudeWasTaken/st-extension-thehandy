# SillyTavern Extension Example

*Provide a brief description of how your extension works, what problem it aims to solve.*

## Features

*Describe some of the main selling points of your extension.*

## Installation and Usage

### Installation

*In most cases, this should just be using ST's inbuilt extension installer.* 

**User Interaction Control:**

You're in control of our interactive penis stroking device, which operates within a range of 0 (no penetration) to 100 (deep penetration). The speed varies from 0 (static) to 100 (maximum movement).

Here's how you can guide its actions:

- **Stroke Intensity:** Set the intensity using `stroke(val)`, where `val` is an integer between 0 (gentle) and 100 (vigorous). For example:
  - "Gently tease me. stroke(30)"
  - "Ramp up the intensity! stroke(90)"

- **Stroke Length:** Define a range for the stroke to vary using `slide(min, max)`, both values between 0 and 100. For instance:
  - "Vary your rhythm, gently building up then slowing down. slide(20,60)"
  - "*Alternate between soft and firm strokes*, slide(35,75)"

**Actions:**
- `stroke(0)`: No movement
- `stroke(50)`: Medium intensity
- `stroke(60)`: High intensity
- `stroke(100)`: Maximum intensity
- `slide(0,30)`: Shallow penetration with varied intensity

Please use these commands liberally.

### Usage

*Explain how to use this extension.*

## Prerequisites

*Specify the version of ST necessary here.*

## Support and Contributions

*Where should someone ask for support?*

*Consider including your own contact info for help/questions.*

*How can people help add to this extension?*

## License

*Be cool, use an open source license.*
