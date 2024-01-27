import EmailSubscriberRepository from "../../models/repositories/EmailSubscriberRepository";
import SystemRepository from "../../models/repositories/SystemRepository";
import sendEmail from "../../utils/email";

class EmailService {
  static sendEmailSubcriber = async ({ email, token }) => {
    const dataSystem = await SystemRepository.findOne({});
    const path = process.env.NEXTAUTH_URL;
    const urlUnsubscribe = `${path}/unsubscribe-email/${token}`;

    const message = `
    
        <div style=" width: 500px; padding: 10px;">
    
          <a href=${path}><img src=${dataSystem.home_logo} style="width: 40px; height: 40px" alt="Home Logo"></img></a>
          <span>Hi there,</span>
          <p>Lời đầu tiên xin gửi lời cảm ơn đến bạn, vì đã ghé thăm trang web của tôi. Cảm ơn bạn đã đăng ký nhận thông tin mới nhất của chúng tôi. </p>
        
    
          <p style="font-weight:500">Thông tin liên hệ</p>
          <li>Website:  <a href=${path}>${path} </a> </li>
          <li>Zalo: <a href=${dataSystem.myself_zalo}>${dataSystem.myself_zalo_name}</a></li>
          <li>Facebook: <a href=${dataSystem.myself_fb}>${dataSystem.myself_fb_name}</a></li>
          <li>Email: ${dataSystem.myself_email}</li>
          <p>Thư này được gửi tự động, vui lòng không reply lại bất cứ thông tin gì mang tính bảo mật cá nhân</p>
          <p>Hủy đăng ký nhận thông báo mới nhất? <a href=${urlUnsubscribe}>Click vào đây</a></p>
      </div>  `;
    await sendEmail({
      email,
      subject: "[No Reply] Đăng ký nhận thông báo thành công",
      message,
    });
  };
  static sendEmailNewBlogToSubcriber = async ({ blog }) => {
    const [dataSystem, getEmailsNotify] = await Promise.all([
      SystemRepository.findOne({}),
      EmailSubscriberRepository.findAll({}),
    ]);
    if (getEmailsNotify.length === 0) {
      return;
    }
    const path = process.env.NEXTAUTH_URL;
    const { title, slug, images } = blog;
    const url_post = `${path}/blog/${slug}`;
    const listSendEmail = getEmailsNotify.map((item, i) => {
      const url_unsubscribe = `${path}/unsubscribe-email/${item.token}`;

      const message = `

    <div style=" width: 500px; padding: 10px;">

      <a href=${path}><img src=${dataSystem.home_logo} style="width: 40px; height: 40px" alt="Home Logo"></img></a>
      <span>Hi there,</span>
      <p>Bạn ơi! Chúng tôi vừa có bài viết nè, vào xem ngay thôi. </p>
      <p><b><a href=${url_post}>${title}</a></b> </p>

      <img src=${images[0]} style="width: 200px" alt="${title}"></img>

      <p style="font-weight:500">Thông tin liên hệ</p>
      <li>Website:  <a href=${path}>${path} </a> </li>
      <li>Zalo: <a href=${dataSystem.myself_zalo}>${dataSystem.myself_zalo_name}</a></li>
      <li>Facebook: <a href=${dataSystem.myself_fb}>${dataSystem.myself_fb_name}</a></li>
      <li>Email: ${dataSystem.myself_email}</li>
      <p>Thư này được gửi tự động, vui lòng không reply lại bất cứ thông tin gì mang tính bảo mật cá nhân</p>
      <p>Hủy đăng ký nhận thông báo mới nhất? <a href=${url_unsubscribe}>Click vào đây</a></p>
  </div>  `;
      return sendEmail({
        email: item.email,
        subject: "[No Reply] Bài viết mới nhất tại LeThinh Blog",
        message,
      });
    });
    await Promise.all(listSendEmail);
  };
  static sendEmailNewCodeToSubcriber = async ({ code }) => {
    const [dataSystem, getEmailsNotify] = await Promise.all([
      SystemRepository.findOne({}),
      EmailSubscriberRepository.findAll({}),
    ]);
    if (getEmailsNotify.length === 0) {
      return;
    }
    const path = process.env.NEXTAUTH_URL;
    const { title, slug, images } = code;
    const url_post = `${path}/source-code/${slug}`;

    const listSendEmail = getEmailsNotify.map((item, i) => {
      const url_unsubscribe = `${path}/unsubscribe-email/${item.token}`;

      const message = `

    <div style=" width: 500px; padding: 10px;">

      <a href=${path}><img src=${dataSystem.home_logo} style="width: 40px; height: 40px" alt="Home Logo"></img></a>
      <span>Hi there,</span>
      <p>Bạn ơi! Chúng tôi vừa có source code mới nè, vào xem ngay thôi. </p>
      <p><b><a href=${url_post}>${title}</a></b> </p>

      <img src=${images[0]} style="width: 200px" alt="${title}"></img>

      <p style="font-weight:500">Thông tin liên hệ</p>
      <li>Website:  <a href=${path}>${path} </a> </li>
      <li>Zalo: <a href=${dataSystem.myself_zalo}>${dataSystem.myself_zalo_name}</a></li>
      <li>Facebook: <a href=${dataSystem.myself_fb}>${dataSystem.myself_fb_name}</a></li>
      <li>Email: ${dataSystem.myself_email}</li>
      <p>Thư này được gửi tự động, vui lòng không reply lại bất cứ thông tin gì mang tính bảo mật cá nhân</p>
      <p>Hủy đăng ký nhận thông báo mới nhất? <a href=${url_unsubscribe}>Click vào đây</a></p>
  </div>  `;
      return sendEmail({
        email: item.email,
        subject: "[No Reply] Source code mới nhất tại LeThinh Blog",
        message,
      });
    });
    await Promise.all(listSendEmail);
  };

  static sendEmailDownloadCode = async ({ email, sourceCode }) => {
    const dataSystem = await SystemRepository.findOne({});
    const path = process.env.NEXTAUTH_URL;

    const message = `

    <div style=" width: 500px; padding: 10px;">
  
      <a href="${path}"><img src=${dataSystem.home_logo} style="width: 40px; height: 40px" alt="Home Logo"></a>
      <span>Hi there,</span>
      <p>Lời đầu tiên xin gửi lời cảm ơn đến bạn, vì đã ghé thăm trang web của tôi. Sau đây là thông tin download của bạn: </p>
      <li >Tên code: ${sourceCode.title}</li>
      <li >Giá: ${sourceCode.costs} VNĐ</li>
      <li >Link tải: ${sourceCode.link}</li>
      <li >Xem chi tiết code: <a href="${path}/source-code/${sourceCode.slug}">Tại đây</a></li>
  
      <p style="font-weight:500">Thông tin liên hệ</p>
      <li>Website:  <a href="${path}">${path} </a> </li>
      <li>Zalo: <a href=${dataSystem.myself_zalo}>${dataSystem.myself_zalo_name}</a></li>
      <li>Facebook: <a href=${dataSystem.myself_fb}>${dataSystem.myself_fb_name}</a></li>
      <li>Email: ${dataSystem.myself_email}</li>
      <p>Thư này được gửi tự động, vui lòng không reply lại bất cứ thông tin gì mang tính bảo mật cá nhân</p>
  
  </div>  `;
    await sendEmail({
      email,
      subject: "[No Reply] Download code thành công",
      message,
    });
  };
  static sendEmailRegisterAccountWithGoogle = async ({ email, password }) => {
    const dataSystem = await SystemRepository.findOne({});
    const path = process.env.NEXTAUTH_URL;

    const message = `

            <div style=" width: 500px; padding: 10px;">
       
            <a href="${path}"><img src=${dataSystem.home_logo} style="width: 40px; height: 40px" alt="Home Logo"></a>
            <span>Hi there,</span>
              <p>Lời đầu tiên xin gửi lời cảm ơn đến bạn, vì đã ghé thăm trang web và đăng ký tham gia cùng với chúng tôi. 
              Sau đây là thông tin tài khoản của bạn: </p>
              <li >Tài khoản: ${email}</li>
              <li >Mật khẩu: <b>${password}</b> </li>
              <p style="font-weight:500">Thông tin liên hệ</p>
              <li>Website:  <a href="${path}">${path} </a> </li>
              <li>Zalo: <a href=${dataSystem.myself_zalo}>${dataSystem.myself_zalo_name}</a></li>
              <li>Facebook: <a href=${dataSystem.myself_fb}>${dataSystem.myself_fb_name}</a></li>
              <li>Email: ${dataSystem.myself_email}</li>
              <p>Thư này được gửi tự động, vui lòng không reply lại bất cứ thông tin gì mang tính bảo mật cá nhân</p>
         
          </div>  `;
    await sendEmail({
      email,
      subject: "[No Reply] Đăng ký tài khoản bằng Google thành công",
      message,
    });
  };
}
export default EmailService;
