export function validateAssignment(form: {
  title?: string;
  courseId?: number | string;
  dueDate?: string;
  description?: string;
}): Record<string, string> {
  const err: Record<string, string> = {};
  if (!form.title || !form.title.trim()) {
    err.title = 'Tiêu đề bài tập không được để trống';
  }
  if (!form.courseId) {
    err.courseId = 'Vui lòng chọn môn học';
  }
  if (!form.dueDate || !form.dueDate.trim()) {
    err.dueDate = 'Vui lòng nhập hạn nộp';
  } else {
    let d = new Date(form.dueDate.trim());
    if (isNaN(d.getTime())) {
      const parts = form.dueDate.trim().split('/');
      if (parts.length === 3) {
        d = new Date(
          Number(parts[2]),
          Number(parts[1]) - 1,
          Number(parts[0]),
          23,
          59,
          0,
        );
      }
    }
    if (isNaN(d.getTime())) {
      err.dueDate = 'Định dạng ngày không hợp lệ (YYYY-MM-DD hoặc DD/MM/YYYY)';
    } else if (d.getTime() < Date.now()) {
      err.dueDate = 'Hạn nộp không được ở trong quá khứ';
    }
  }
  return err;
}

export function validateProfile(form: {
  fullName?: string;
  email?: string;
  phone?: string;
}): Record<string, string> {
  const err: Record<string, string> = {};
  if (!form.fullName || !form.fullName.trim()) {
    err.fullName = 'Họ tên không được để trống';
  }
  if (!form.email || !form.email.trim()) {
    err.email = 'Email không được để trống';
  } else if (!form.email.includes('@')) {
    err.email = 'Email không hợp lệ';
  }
  if (!form.phone || !form.phone.trim()) {
    err.phone = 'Số điện thoại không được để trống';
  } else if (form.phone.trim().length < 9) {
    err.phone = 'Số điện thoại phải từ 9 chữ số';
  }
  return err;
}

export default {
  validateAssignment,
  validateProfile,
};

