## TV4R: The TV of the Internet

TV4R is a television interface for reddit, the front page of the internet.
TV4R runs entirely in your browser and relies only on the reddit API.

![TV4R](./public/top.jpg)

#### Description

Watch the latest videos from any subreddit, played back-to-back without interuptions.
You can also view images, gifs, embedded webpages, twitter posts, and maybe more!
Load up your favorite subreddit and enjoy what the internet is watching.

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
- [x] Look at reddit images and gifs, webpages, selfposts, twitter
- [x] Read from new, controversial, top, and rising
- [ ] Load all videos by 'domain' (e.g. youtube.com)

#### Maybe Goals

- [ ] Load subreddits from authenticated reddit profile
- [ ] Vote on reddit posts and comments
- [ ] Write reddit comments

#### Non Goals

- [ ] Source content from non-reddit sources
- [ ] Override native players

#### Running locally

To get started running TVR locally, start by cloning this repo:

`$ git clone https://github.com/lastcanal/tvr`

Install the dependancies

`$ yarn`

Run the dev-server

`$ yarn start`

Run the tests

`$ yarn test`

Auto-fix linter errors

`$ yarn fix`

Build a release

`$ yarn build`

#### Contributing

TV4R is written using React and Redux. Install [Redux Devtools](https://extension.remotedev.io/) to see what is happening under the hood.

Pull requests, issues, bug reports and ideas are all welcome!

There are 2 babel optional propoals in use in this app:

Optional Chaining: Use whenever possible!

Pipeline Operator: Use only when wrapping exported components with higher-order components (HOCs)

#### Licence

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

##### Extra

[Watch the Ramsay video pictured above](https://youtu.be/vBhyT5BJJaU)
