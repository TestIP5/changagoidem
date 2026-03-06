using BLL.interfaces;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BinhLuanCT : ControllerBase
    {
        private readonly IBinhLuanBS _iCommentBLL;
        public BinhLuanCT(IBinhLuanBS iCommentBLL)
        {
            _iCommentBLL = iCommentBLL ?? throw new Exception(nameof(iCommentBLL));
        }


        [Route("ThemBinhLuan")]
        [HttpPost]
        public IActionResult CreateComment([FromBody] BinhLuan comment)
        {
            try
            {
                _iCommentBLL.InsertComment(comment);
                return Ok(new { mesage = "Insert thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("SuaBinhLuan")]
        [HttpPost]
        public IActionResult UpdateComment([FromBody] BinhLuan comment)
        {
            try
            {
                _iCommentBLL.UpdateComment(comment);
                return Ok(new { mesage = "Update thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("XoaBinhLuan")]
        [HttpPost]
        public IActionResult DeleteComment(int id)
        {
            try
            {
                _iCommentBLL.DeleteComment(id);
                return Ok(new { mesage = $"Xóa thành công {id}" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
