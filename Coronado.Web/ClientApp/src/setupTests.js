import { configure } from "enzyme";
import Adapter from 'enzyme-adapter-react-16';

//setupJest.js or similar file
global.fetch = require('jest-fetch-mock')

configure({adapter: new Adapter()});