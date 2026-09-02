const fs = require('fs');
let c = fs.readFileSync('frontend/src/components/dashboard/SocialPreviewHub.tsx', 'utf8');
c = c.replace(/RescueAI \u00E2\u20AC\u201D AI Disaster Response/g, 'RescueAI — AI Disaster Response');
c = c.replace(/10:42 PM \u00E2\u0153\u201C\u00E2\u0153\u201C/g, '10:42 PM ✓✓');
c = c.replace(/\u00F0\u0178\u201D\u2014/g, '🔗');
fs.writeFileSync('frontend/src/components/dashboard/SocialPreviewHub.tsx', c, 'utf8');
