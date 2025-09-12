let total_user = 1000;
let user_clicks = 200;
let user_purchase = 50;

let p_h = user_clicks / total_user;
let p_w_and_h = user_purchase / total_user;

console.log('P(h):', p_h);
console.log('P(wcaph):', p_w_and_h);

if (p_h > 0) {
    let p_w_given_h = p_w_and_h / p_h;
    console.log(`The probablity of buying given a click is: ${p_w_given_h}`);
} else { console.log('Cannot calculate conditional probablity, as the probability of the given event is zero') };