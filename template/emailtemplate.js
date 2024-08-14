const emailTemplate = (url) => `
<p>Please verify your email by clicking on the following link: <a href="${url}" target="_blank">${url}</a></p>`;

export default emailTemplate;
