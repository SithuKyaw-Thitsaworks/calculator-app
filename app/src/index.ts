"use strict";

import {Service} from "./service";

Service.start().then(() => {
    console.log("Calculator service has started...");
});
