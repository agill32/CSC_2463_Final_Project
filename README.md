# CSC_2463_Final_Project
### Project Description
Puzzle Runner is a simple game made with p5 Play, Tone Js, and Arduino. The objective of the game is to make it from one side of the level to the other and reach the treasure. You're an explorer and you have to avoid the mummies that spawn randomly around the map at different speeds. You have 3 lives and 60 seconds to make it to the treasure. If not, you get sent back to the starting page to try again. There's background music that speeds up as the timer gets lower, and resets to its original speed when you get sent back to the starting menu. If you make it to the end, then the music completely stops on the win page. On the win page as well, you get a note of how many seconds you had left. There are also footsteps sound effects whenever your character walks. Finally, there's coded Arduino functionality for walking and an LED for the timer.

Sketch Page: https://agill32.github.io/CSC_2463_Final_Project/Final_Project/

### Project Parts
#### Graphics
- Two classes: a player and an enemy class
- Drawn spritesheets for player and mummies, as well as images for the starting page, walls, and treasure.
- 3 Gamestates; Start, play, and end
- Functional Timer ticking down from 60
- 3 Lives that go down upon collision with enemy sprite
- Collisions around sketch to prevent player and enemies escaping
#### Sound
- Custom background music using a part and a polysynth
- Background music BPM speeds up depending on time left
- Sampled footstep sound effect
#### Hardware
- LED linked to timer to get dimmer as timer goes down
- Four buttons control up, down, left, and right movements for the player

### Images and Videos
Video of Project Working: https://youtu.be/JnDcePdzZD0

Project start screen: https://drive.google.com/file/d/1kzh5NvefRXz1eSAEbsBHnXlrMDxZjmh7/view?usp=drive_link

Project play screen: https://drive.google.com/file/d/1Pfve2pzQt_957gdPbqXE8fcmpz7KJjyT/view?usp=drive_link

Project end scene: https://drive.google.com/file/d/1XHadJPI0lgmzpFZJ5hetqvY8F8KVAqfU/view?usp=drive_link

### Hardware Description
Real Life Schematics: https://drive.google.com/file/d/1F9_swalSHSGmZ77XBdQUArLqAyiNhLkw/view?usp=sharing

Digital Schematics: https://drive.google.com/file/d/1wy_FPNCqFaEeRf29cC4ZPVUnP8pQYu-o/view?usp=sharing

#### Needed hardware;
- Arduino board
- 1 LED, color optional
- 4 buttons
- 4 10k ohm resistors
- 1 220 ohm resistor
- Various wires

#### Other notes:
- LED Pin is connected to 11
- W / up is connected to 2
- S / down is connected to 3
- D / right is connected to 4
- A / left is connected to 5
- Make sure button pin wires are connected on the opposite side of the ohm resistor
