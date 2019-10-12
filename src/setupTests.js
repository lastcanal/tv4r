import {GlobalWithFetchMock} from "jest-fetch-mock";

const customGlobal: GlobalWithFetchMock = global;
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchMock = customGlobal.fetch;
