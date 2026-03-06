using BLL.interfaces;
using DAL.Interfaces;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class CTGioHangBS : ICTGioHangBS
    {
        private readonly ICTGioHangRP _iCommentDAL;
        public CTGioHangBS(ICTGioHangRP iComment)
        {
            _iCommentDAL = iComment ?? throw new Exception(nameof(iComment));
        }


        public void InsertCTGioHang(ChiTietGioHang1 comment)
        {
            _iCommentDAL.InsertComment(comment);
        }

        public void UpdateCTGioHangTang(ChiTietGioHang1 comment)
        {
            _iCommentDAL.UpdateCommentI(comment);
        }

        public void UpdateCTGioHangGiam(ChiTietGioHang1 comment)
        {
            _iCommentDAL.UpdateCommentD(comment);
        }

        public void DeleteCTGioHang(int commentID, int commentID2)
        {
            _iCommentDAL.DeleteComment(commentID,commentID2);
        }

        public List<ChiTietGioHang> GetAll()
        {
            return _iCommentDAL.GetAll();
        }
    }
}
