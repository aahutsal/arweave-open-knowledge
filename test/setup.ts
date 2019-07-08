// test/setup.ts
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({adapter:new Adapter()})

declare global {
    namespace NodeJS {
        export interface Global {
            chai: any;
            mount: any;
            render: any;
            shallow: any;
            chaiEnzyme: any;
        }
    }
}
// Add commonly used methods and objects as globals
global.chai = chai

global.mount = mount;
global.render = render;
global.shallow = shallow;

Object.defineProperty(window, 'crypto', {value: require('crypto')});
Object.defineProperty(window.crypto, 'subtle', {value: require('subtle')});

chai.use(chaiEnzyme());

