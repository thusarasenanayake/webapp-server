var nodemailer = require('nodemailer')
const config = require('../config')

exports.mailService = async (props) => {
  let content = ``
  console.log(props)
  if (props.type === 'password-reset') {
    content = `
	<!DOCTYPE html>
	<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
	</head>
	<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;">
		<tbody>
			<tr>
				<td>
					<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 500px;" width="500">
						<tbody>
							<tr>
								<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 15px; padding-bottom: 20px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
									<table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
										<tr>
											<td style="padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;">
												<div align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/2966/gif-resetpass.gif" style="display: block; height: auto; border: 0; width: 350px; max-width: 100%;" width="350" alt="reset-password" title="hello"></div>
											</td>
										</tr>
									</table>
									<table class="heading_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
										<tr>
											<td style="text-align:center;width:100%;">
												<h1 style="margin: 0; color: #393d47; direction: ltr; font-family: Tahoma, Verdana, Segoe, sans-serif; font-size: 25px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Forgot your password?</strong></h1>
											</td>
										</tr>
									</table>
									<table class="text_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
										<tr>
											<td>
												<div style="font-family: Tahoma, Verdana, sans-serif">
													<div class="txtTinyMce-wrapper" style="font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 18px; color: #393d47; line-height: 1.5;">
														<p style="margin: 0; font-size: 14px; text-align: center; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 21px;"><span style="font-size:14px;"><span style>Not to worry, we got you! </span><span style>Let’s get you a new password. Please change your password after login.</span></span></p>
													</div>
												</div>
											</td>
										</tr>
									</table>
									<table class="button_block" width="100%" border="0" cellpadding="15" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
										<tr>
											<td>
												<div align="center">
													<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.yourwebsite.com" style="height:58px;width:272px;v-text-anchor:middle;" arcsize="35%" strokeweight="0.75pt" strokecolor="#FFC727" fillcolor="#ffc727"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#393d47; font-family:Tahoma, Verdana, sans-serif; font-size:18px"><![endif]--><a href="http://localhost:3000/reset" target="_blank" style="text-decoration:none;display:inline-block;color:#393d47;background-color:#ffc727;border-radius:20px;width:auto;border-top:1px solid #FFC727;border-right:1px solid #FFC727;border-bottom:1px solid #FFC727;border-left:1px solid #FFC727;padding-top:10px;padding-bottom:10px;font-family:Tahoma, Verdana, Segoe, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:50px;padding-right:50px;font-size:18px;display:inline-block;letter-spacing:normal;"><span style="font-size: 16px; line-height: 2; word-break: break-word; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 32px;"><span style="font-size: 18px; line-height: 36px;" data-mce-style="font-size: 18px; line-height: 36px;"><strong>${props.password}</strong></span></span></span></a>
													<!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
												</div>
											</td>
										</tr>
									</table>
									<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
										<tr>
											<td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
												<div style="font-family: Tahoma, Verdana, sans-serif">
													<div class="txtTinyMce-wrapper" style="font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; text-align: center; mso-line-height-alt: 18px; color: #393d47; line-height: 1.5;"><span style="font-size:13px;">If you didn’t request to change your password, simply ignore this email.</span></div>
												</div>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
	</body>
	</html>
	`
  } else if (props.type === 'order-confirmation') {
    content = `
		<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e7e7e7;color: #000000">
		<!--[if IE]><div class="ie-container"><![endif]-->
		<!--[if mso]><div class="mso-container"><![endif]-->
		  <!--methana idan-->>
		<table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%" cellpadding="0" cellspacing="0">
		<tbody>
		<tr style="vertical-align: top">
		  <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
		  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e7e7e7;"><![endif]-->
		  
	  
	  <div class="u-row-container bayengage_cart_repeat" style="padding: 0px;background-color: transparent">
		<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
		  <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
			<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px;"><tr style="background-color: #ffffff;"><![endif]-->
			
	  <!--[if (mso)|(IE)]><td align="center" width="640" style="width: 640px;padding: 0px 10px 10px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
	  <div class="u-col u-col-100" style="max-width: 320px;min-width: 640px;display: table-cell;vertical-align: top;">
		<div style="width: 100% !important;">
		<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px 10px 10px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
		
	  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
		<tbody>
		  <tr>
			<td style="overflow-wrap:break-word;word-break:break-word;padding:0px 0px 10px;font-family:arial,helvetica,sans-serif;" align="left">
		<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="87%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px dotted #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
		  <tbody>
			<tr style="vertical-align: top">
			  <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
				<span>&#160;</span>
			  </td>
			</tr>
		  </tbody>
		</table>
			</td>
		  </tr>
		</tbody>
	  </table>
	  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
		<tbody>
		  <tr>
			<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
	  <table width="100%" cellpadding="0" cellspacing="0" border="0">
		<tr>
		  <td style="padding-right: 0px;padding-left: 0px;" align="center">
			
			<img align="center" border="0" src="https://img.bayengage.com/assets/1641809645206-1613615720006-tick (1).jpg" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 106px;" width="106"/>
		  </td>
		</tr>
	  </table>
			</td>
		  </tr>
		</tbody>
	  </table>
	  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
		<tbody>
		  <tr>
			<td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:arial,helvetica,sans-serif;" align="left">
		<div style="line-height: 130%; text-align: left; word-wrap: break-word;">
		  <p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 36px; line-height: 50.4px;"><strong><span style="line-height: 50.4px; font-family: Poppins, sans-serif; font-size: 36px;">${props.message}</span></strong></span></p>
		  <table class="button_block" width="100%" border="0" cellpadding="15" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
			  <tr>
				  <td>
					  <div align="center">
						  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://localhost:3000/myorders/${props.order_id}" style="height:58px;width:272px;v-text-anchor:middle;" arcsize="35%" strokeweight="0.75pt" strokecolor="#FFC727" fillcolor="#ffc727"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#393d47; font-family:Tahoma, Verdana, sans-serif; font-size:18px"><![endif]--><a href="http://localhost:3000/myorders/${props.order_id}" target="_blank" style="text-decoration:none;display:inline-block;color:#393d47;background-color:#ffc727;border-radius:20px;width:auto;border-top:1px solid #FFC727;border-right:1px solid #FFC727;border-bottom:1px solid #FFC727;border-left:1px solid #FFC727;padding-top:10px;padding-bottom:10px;font-family:Tahoma, Verdana, Segoe, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:50px;padding-right:50px;font-size:18px;display:inline-block;letter-spacing:normal;"><span style="font-size: 16px; line-height: 2; word-break: break-word; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 32px;"><span style="font-size: 18px; line-height: 36px;" data-mce-style="font-size: 18px; line-height: 36px;"><strong>View Order Details</strong></span></span></span></a>
						  <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
					  </div>
				  </td>
			  </tr>
		  </table>
		  </div>
			</td>
		  </tr>
		</tbody>
	  </table>
	  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
		<tbody>
			<td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
		<div style="line-height: 140%; text-align: left; word-wrap: break-word;">
		  <p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 16px; line-height: 22.4px; font-family: Poppins, sans-serif;">This email is to confirm your recent order. <strong>Order ID: ${props.order_id}</strong></span></p>
		</div>
			</td>
		  </tr>
		</tbody>
	  </table>
	  </body>
		`
  } else if (props.type === 'promotion') {
    content = props.promotion.promotion
  } else if (props.type === 'single-promotion') {
    content = props.promotion
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.sendEmailAddress,
      pass: config.sendEmailPassword,
    },
  })

  if (props.email) {
    let info = await transporter.sendMail({
      from: `"Ruwan Bakehouse Online Ordering System" <${config.sendEmailAddress}>`,
      to: props.email,
      subject: props.subject,
      html: content,
    })

    console.log('Message sent: %s', info.messageId)
  }
}
