# TVR: The TV of the Internet

TVR is a television interface for reddit, the front page of the internet.
TVR runs entirely in your browser, only relying on the reddit API.

#### Description

TVR lets you watch the latest videos from any subreddit and play them 
back-to-back without interuptions. Load up your favorite subreddit then 
sit back and enjoy what the internet is watching. 

#### Common Shortcuts

- `>` or `.` plays next post
- `<` or `,` plays previous post
- `SpaceBar` or `Enter` toggles play/pause
- `a` Auto Advance
- `f` Fullscreen
- `Esc` Exit Fullscreen
- `↑` Increase Volume
- `↓` Decrease Volume
- `←` Go back 5 seconds
- `→` Go forward 10 seconds

#### Skip to certain parts of the video

- `0` Go to the 0% mark
- `1` Go to the 10% mark
- `2` Go to the 20% mark
- `3` Go to the 30% mark
- `4` Go to the 40% mark
- `5` Go to the 50% mark
- `6` Go to the 60% mark
- `7` Go to the 70% mark
- `8` Go to the 80% mark
- `9` Go to the 90% mark
- `End`	Go to the End

#### Goals

- [x] Watch reddit videos
- [x] Read reddit comments
- [ ] Look at reddit images and gifs
- [ ] Listen to reddit audio
- [ ] Read from new, controversial, top, and rising
- [ ] Load all videos by 'domain' (e.g. youtube.com)
- [ ] Load subreddits from authenticated reddit profile
- [ ] Vote on reddit posts and comments
- [ ] Write reddit comments

#### Non Goals

- [x] Source content from non-reddit sources
- [x] Override native players

#### Running locally

To get started running TVR locally, start by cloning this repo:

`$ git clone https://github.com/lastcanal/tvr`

Install the dependancies

`$ yarn`

Run the dev-server

`$ yarn start`

Run the tests

`$ yarn test`

Build a release

`$ yarn build`

#### Contributing

TVR is written using React and Redux. Install [Redux Devtools](https://extension.remotedev.io/) to see what is happening under the hood. 

#### Licence

MIT
