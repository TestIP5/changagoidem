using BLL.interfaces;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonHangCT : ControllerBase
    {
        private readonly IDonHangBS _iHoaDonBLL;
        public DonHangCT(IDonHangBS iHoaDonBLL)
        {
            _iHoaDonBLL = iHoaDonBLL ?? throw new Exception(nameof(iHoaDonBLL));
        }
        [Route("LayDonHangTheoMa")]
        [HttpGet]
        public IActionResult GetByID(int id) 
        {
            try
            {
                var hoaDon = _iHoaDonBLL.GetHoaDonByID(id);
                if (hoaDon == null)
                {
                    return NotFound($"Không tìm thấy hóa đơn có ID: {id}");
                }
                else
                {
                    return Ok(new {mesage = $"Tìm thấy Hóa Đơn có ID: {id}", data = hoaDon});
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }
    }
}
