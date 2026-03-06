using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface IBinhLuanRP
    {
        void InsertComment(BinhLuan comment);

        void UpdateComment(BinhLuan comment);

        void DeleteComment(int commentID);

        List<BinhLuan> GetCommentByID(int commentID);

        List<BinhLuan> GetAll();
    }
}
