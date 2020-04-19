import { createBrowserHistory } from "history";

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
export default createBrowserHistory({ basename: baseUrl });