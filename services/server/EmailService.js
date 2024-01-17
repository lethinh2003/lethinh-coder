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
}
export default EmailService;
