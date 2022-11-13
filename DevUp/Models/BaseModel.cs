using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DevUp.Models
{
    public abstract class BaseModel
    {
        public int Id { get; set; }
        public int CreateUid { get; set; }
        public int UpdateUid { get; set; }
        [ForeignKey("CreateUid")]
        public virtual ApplicationUser CreateBy { get; set; }
        [ForeignKey("UpdateUid")]
        public virtual ApplicationUser UpdateBy { get; set; }
        [Required]
        public DateTime CreateDate { get; set; }
        public DateTime? UpdateDate { get; set; }

        [JsonIgnore]
        public DateTime? DeletedDate { get; set; }
        public bool IsDeleted => DeletedDate.HasValue;
    }
}
