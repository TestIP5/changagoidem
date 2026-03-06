using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface ICTGioHangRP
    {
        void InsertComment(ChiTietGioHang1 comment);

        void UpdateCommentI(ChiTietGioHang1 comment);

        void UpdateCommentD(ChiTietGioHang1 comment);

        void DeleteComment(int commentID,int commentID2);


        List<ChiTietGioHang> GetAll();
    }
}
