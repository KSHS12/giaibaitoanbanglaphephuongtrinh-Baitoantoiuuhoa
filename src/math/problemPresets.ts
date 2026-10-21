import { ProblemModel } from '../types/problemTypes';

export const PROBLEM_PRESETS: ProblemModel[] = [
  // ==========================================
  // NHÓM 1: HỆ BẤT PHƯƠNG TRÌNH & QUY HOẠCH TUYẾN TÍNH (TOÁN 10)
  // ==========================================
  {
    id: 'bpt-ban-ghe',
    title: 'Tối ưu hóa lợi nhuận xưởng mộc sản xuất bàn ghế',
    category: 'inequality_system',
    categoryName: 'Hệ bất phương trình & Quy hoạch tuyến tính',
    grade: 'Toán 10',
    topic: 'quy_hoach_tuyen_tinh',
    topicName: 'Quy hoạch tuyến tính (Tối ưu hóa)',
    statement:
      'Một xưởng mộc chuyên sản xuất hai loại sản phẩm: Bàn (loại I) và Ghế (loại II). Để sản xuất một chiếc bàn cần 2 giờ làm việc của máy xẻ và 3 giờ làm việc của thợ ráp. Để sản xuất một chiếc ghế cần 1 giờ làm việc của máy xẻ và 1 giờ làm việc của thợ ráp. Trong một tuần, máy xẻ chỉ có thể hoạt động tối đa 40 giờ và thợ ráp chỉ có thể làm việc tối đa 50 giờ. Mỗi chiếc bàn mang lại lợi nhuận 400.000 đồng, mỗi chiếc ghế mang lại lợi nhuận 200.000 đồng. Hãy lập kế hoạch sản xuất trong tuần để xưởng mộc thu được lợi nhuận lớn nhất.',
    practicalContext:
      'Bài toán quản trị sản xuất thực tế trong SGK Toán 10 mới (Kết nối tri thức), ứng dụng mô hình Quy hoạch tuyến tính hai biến để tối ưu hóa nguồn lực máy móc và nhân công.',
    variables: [
      {
        symbol: 'x',
        meaning: 'Số lượng bàn (loại I) xưởng sản xuất trong một tuần',
        unit: 'chiếc',
        condition: 'x \\ge 0, x \\in \\mathbb{N}',
      },
      {
        symbol: 'y',
        meaning: 'Số lượng ghế (loại II) xưởng sản xuất trong một tuần',
        unit: 'chiếc',
        condition: 'y \\ge 0, y \\in \\mathbb{N}',
      },
    ],
    summaryTable: {
      title: 'Bảng phân tích nguồn lực và định mức sản xuất',
      headers: ['Công đoạn / Nguồn lực', '1 Bàn (loại I)', '1 Ghế (loại II)', 'Giới hạn khả dụng trong tuần'],
      rows: [
        ['Thời gian máy xẻ (giờ)', '2 giờ', '1 giờ', 'Tối đa 40 giờ'],
        ['Thời gian thợ ráp (giờ)', '3 giờ', '1 giờ', 'Tối đa 50 giờ'],
        ['Lợi nhuận (nghìn đồng)', '400', '200', 'F(x, y) = 400x + 200y → Max'],
      ],
    },
    setupExplanation: [
      'Tổng thời gian máy xẻ hoạt động trong tuần là 2x + y (giờ). Vì máy xẻ hoạt động tối đa 40 giờ nên ta có: 2x + y \\le 40.',
      'Tổng thời gian thợ ráp làm việc trong tuần là 3x + y (giờ). Vì thợ ráp làm việc tối đa 50 giờ nên ta có: 3x + y \\le 50.',
      'Số lượng sản phẩm không thể âm, do đó: x \\ge 0 và y \\ge 0.',
      'Tổng lợi nhuận thu được trong tuần (đơn vị: nghìn đồng) là: F(x, y) = 400x + 200y.',
    ],
    equationLatexList: [
      '\\begin{cases} 2x + y \\le 40 \\\\ 3x + y \\le 50 \\\\ x \\ge 0 \\\\ y \\ge 0 \\end{cases}',
      'F(x, y) = 400x + 200y \\longrightarrow \\max',
    ],
    linearProgrammingData: {
      constraints: [
        {
          id: 'c1',
          label: 'd1: 2x + y = 40',
          a: 2,
          b: 1,
          op: '<=',
          c: 40,
          meaning: 'Giới hạn thời gian máy xẻ',
        },
        {
          id: 'c2',
          label: 'd2: 3x + y = 50',
          a: 3,
          b: 1,
          op: '<=',
          c: 50,
          meaning: 'Giới hạn thời gian thợ ráp',
        },
      ],
      objective: {
        name: 'F(x, y)',
        a: 400,
        b: 200,
        target: 'max',
        unit: 'nghìn đồng',
        description: 'Tổng lợi nhuận hàng tuần',
      },
      xRange: [0, 25],
      yRange: [0, 55],
    },
    solutionSteps: {
      methodTitle: 'Phương pháp hình học giải bài toán Quy hoạch tuyến tính',
      subSteps: [
        {
          title: 'Bước 1: Xác định các đường biên trên mặt phẳng tọa độ Oxy',
          content:
            'Vẽ các đường thẳng biên: (d1): 2x + y = 40 đi qua (0; 40) và (20; 0); (d2): 3x + y = 50 đi qua (0; 50) và (50/3; 0); cùng hai trục tọa độ x = 0 (Oy) và y = 0 (Ox).',
          mathLatex: '(d_1): 2x + y = 40; \\quad (d_2): 3x + y = 50',
        },
        {
          title: 'Bước 2: Xác định miền nghiệm (tứ giác OABC)',
          content:
            'Gạch bỏ các nửa mặt phẳng không thỏa mãn các bất phương trình. Miền nghiệm của hệ bất phương trình là miền tứ giác lồi OABC (kể cả bờ), với các đỉnh:',
          mathLatex: 'O(0; 0), \\; A(0; 40), \\; B(10; 20), \\; C\\left(\\frac{50}{3}; 0\\right)',
        },
        {
          title: 'Bước 3: Tính giá trị hàm mục tiêu F(x, y) tại tất cả các đỉnh',
          content:
            'Theo định lý quy hoạch tuyến tính, giá trị lớn nhất của hàm bậc nhất F(x, y) trên miền đa giác đạt được tại một trong các đỉnh của đa giác đó.',
        },
      ],
      vertices: [
        { name: 'O', x: 0, y: 0, xLatex: '0', yLatex: '0', fValue: 0, fValueLatex: '0' },
        { name: 'A', x: 0, y: 40, xLatex: '0', yLatex: '40', fValue: 8000, fValueLatex: '8\\,000' },
        { name: 'B', x: 10, y: 20, xLatex: '10', yLatex: '20', fValue: 8000, fValueLatex: '8\\,000', isOptimal: true },
        { name: 'C', x: 50 / 3, y: 0, xLatex: '\\frac{50}{3}', yLatex: '0', fValue: 6667, fValueLatex: '6\\,667' },
      ],
    },
    conclusion: {
      overview:
        'Lợi nhuận lớn nhất đạt được là 8.000.000 đồng tại đỉnh B(10; 20) (sản xuất 10 chiếc bàn và 20 chiếc ghế) hoặc tại đỉnh A(0; 40) (chỉ sản xuất 40 chiếc ghế). Cả đoạn thẳng AB đều cho cùng lợi nhuận tối đa 8.000.000 đồng.',
      finalAnswers: [
        { label: 'Phương án sản xuất tối ưu 1', value: '10 bàn và 20 chiếc ghế' },
        { label: 'Phương án sản xuất tối ưu 2', value: '0 bàn và 40 chiếc ghế' },
        { label: 'Lợi nhuận tối đa đạt được', value: '8.000.000 đồng / tuần' },
      ],
      practicalImplication: 'Xưởng mộc nên duy trì phương án (10 bàn, 20 ghế) để đa dạng hóa mặt hàng cung ứng cho thị trường mà vẫn đạt lợi nhuận cực đại.',
    },
  },

  {
    id: 'bpt-dinh-duong',
    title: 'Tối ưu chi phí khẩu phần dinh dưỡng (Vitamin A & B)',
    category: 'inequality_system',
    categoryName: 'Hệ bất phương trình & Quy hoạch tuyến tính',
    grade: 'Toán 10',
    topic: 'hoa_hoc_dinh_duong',
    topicName: 'Dinh dưỡng & Y tế thực tiễn',
    statement:
      'Một chuyên gia dinh dưỡng cần thiết kế khẩu phần ăn từ hai loại thực phẩm X và Y. Mỗi lạng (100g) thực phẩm X chứa 2 đơn vị Vitamin A và 1 đơn vị Vitamin B, giá 6.000 đồng. Mỗi lạng thực phẩm Y chứa 1 đơn vị Vitamin A và 3 đơn vị Vitamin B, giá 8.000 đồng. Yêu cầu tối thiểu mỗi ngày của cơ thể là 8 đơn vị Vitamin A và 9 đơn vị Vitamin B. Ngoài ra, do tính ngon miệng, một ngày người đó ăn không quá 6 lạng thực phẩm X. Hãy xác định khối lượng mỗi loại thực phẩm cần dùng để đảm bảo dinh dưỡng với chi phí thấp nhất.',
    practicalContext:
      'Bài toán tối ưu hóa chi tiêu y tế và dinh dưỡng cổ điển trong quy hoạch tuyến tính, tìm giá trị nhỏ nhất (Min) của hàm chi phí.',
    variables: [
      {
        symbol: 'x',
        meaning: 'Số lạng (100g) thực phẩm X cần dùng mỗi ngày',
        unit: 'lạng',
        condition: '0 \\le x \\le 6',
      },
      {
        symbol: 'y',
        meaning: 'Số lạng (100g) thực phẩm Y cần dùng mỗi ngày',
        unit: 'lạng',
        condition: 'y \\ge 0',
      },
    ],
    summaryTable: {
      title: 'Bảng định mức thành phần dinh dưỡng và giá thành',
      headers: ['Thành phần dinh dưỡng', '1 lạng Thực phẩm X', '1 lạng Thực phẩm Y', 'Yêu cầu tối thiểu'],
      rows: [
        ['Vitamin A (đơn vị)', '2', '1', 'Tối thiểu 8 đơn vị (≥ 8)'],
        ['Vitamin B (đơn vị)', '1', '3', 'Tối thiểu 9 đơn vị (≥ 9)'],
        ['Giới hạn thực phẩm X', '1', '0', 'Tối đa 6 lạng (≤ 6)'],
        ['Giá tiền (đồng/lạng)', '6.000', '8.000', 'T(x, y) = 6x + 8y → Min'],
      ],
    },
    setupExplanation: [
      'Tổng lượng Vitamin A cung cấp là 2x + y. Yêu cầu tối thiểu là 8 nên: 2x + y \\ge 8.',
      'Tổng lượng Vitamin B cung cấp là x + 3y. Yêu cầu tối thiểu là 9 nên: x + 3y \\ge 9.',
      'Không dùng quá 6 lạng thực phẩm X và khối lượng không âm: 0 \\le x \\le 6, y \\ge 0.',
      'Tổng chi phí khẩu phần dinh dưỡng hàng ngày (nghìn đồng): T(x, y) = 6x + 8y.',
    ],
    equationLatexList: [
      '\\begin{cases} 2x + y \\ge 8 \\\\ x + 3y \\ge 9 \\\\ 0 \\le x \\le 6 \\\\ y \\ge 0 \\end{cases}',
      'T(x, y) = 6x + 8y \\longrightarrow \\min',
    ],
    linearProgrammingData: {
      constraints: [
        {
          id: 'c1',
          label: 'd1: 2x + y = 8',
          a: 2,
          b: 1,
          op: '>=',
          c: 8,
          meaning: 'Đảm bảo đủ Vitamin A tối thiểu',
        },
        {
          id: 'c2',
          label: 'd2: x + 3y = 9',
          a: 1,
          b: 3,
          op: '>=',
          c: 9,
          meaning: 'Đảm bảo đủ Vitamin B tối thiểu',
        },
        {
          id: 'c3',
          label: 'd3: x = 6',
          a: 1,
          b: 0,
          op: '<=',
          c: 6,
          meaning: 'Khối lượng thực phẩm X không quá 6 lạng',
        },
      ],
      objective: {
        name: 'T(x, y)',
        a: 6,
        b: 8,
        target: 'min',
        unit: 'nghìn đồng',
        description: 'Chi phí mua thực phẩm hàng ngày',
      },
      xRange: [0, 8],
      yRange: [0, 10],
    },
    solutionSteps: {
      methodTitle: 'Tìm cực tiểu hàm mục tiêu trên miền đa giác không bị chặn / đa giác lồi',
      subSteps: [
        {
          title: 'Bước 1: Vẽ các đường thẳng biên',
          content: 'Vẽ (d1): 2x + y = 8, (d2): x + 3y = 9, (d3): x = 6, Oy: x = 0, Ox: y = 0.',
          mathLatex: '(d_1): 2x + y = 8; \\quad (d_2): x + 3y = 9; \\quad (d_3): x = 6',
        },
        {
          title: 'Bước 2: Tìm tọa độ các đỉnh của miền nghiệm',
          content:
            'Giao điểm của d1 và d2 là A(3; 2). Giao điểm của d1 và Oy là (0; 8). Giao điểm của d2 và d3 là B(6; 1). Đỉnh trên đường x=6 với y=0 hoặc giới hạn.',
          mathLatex: 'A(3; 2), \\; B(6; 1), \\; C(6; 8), \\; D(0; 8)',
        },
      ],
      vertices: [
        { name: 'A', x: 3, y: 2, xLatex: '3', yLatex: '2', fValue: 34, fValueLatex: '34', isOptimal: true },
        { name: 'B', x: 6, y: 1, xLatex: '6', yLatex: '1', fValue: 44, fValueLatex: '44' },
        { name: 'D', x: 0, y: 8, xLatex: '0', yLatex: '8', fValue: 64, fValueLatex: '64' },
      ],
    },
    conclusion: {
      overview: 'Chi phí mua thực phẩm thấp nhất là 34.000 đồng khi sử dụng 3 lạng thực phẩm X và 2 lạng thực phẩm Y.',
      finalAnswers: [
        { label: 'Khối lượng thực phẩm X', value: '3 lạng (300 g)' },
        { label: 'Khối lượng thực phẩm Y', value: '2 lạng (200 g)' },
        { label: 'Chi phí tối thiểu', value: '34.000 đồng / ngày' },
      ],
      practicalImplication: 'Cung cấp vừa đúng 8 đơn vị Vitamin A và 9 đơn vị Vitamin B mà không lãng phí chi phí.',
    },
  },

  {
    id: 'bpt-quang-cao',
    title: 'Phân bổ kinh phí quảng cáo trên Đài truyền hình và Mạng xã hội',
    category: 'inequality_system',
    categoryName: 'Hệ bất phương trình & Quy hoạch tuyến tính',
    grade: 'Toán 10',
    topic: 'kinh_te_tai_chinh',
    topicName: 'Kinh tế & Marketing thực tiễn',
    statement:
      'Một công ty có ngân sách 32 triệu đồng để quảng bá sản phẩm mới trên hai kênh: Đài truyền hình và Mạng xã hội. Chi phí cho một lần phát sóng trên Đài truyền hình là 4 triệu đồng, tiếp cận được khoảng 30.000 khách hàng tiềm năng. Chi phí cho một đợt chạy quảng cáo trên Mạng xã hội là 2 triệu đồng, tiếp cận được khoảng 20.000 khách hàng. Do chính sách của đối tác, công ty chỉ có thể phát tối đa 6 lần trên truyền hình và ít nhất 4 lần trên mạng xã hội. Hãy lập phương án quảng cáo để tổng số khách hàng tiếp cận được là lớn nhất.',
    practicalContext:
      'Bài toán tối ưu hóa chiến dịch Marketing thực tiễn cho học sinh THPT rèn luyện tư duy tài chính.',
    variables: [
      {
        symbol: 'x',
        meaning: 'Số lần phát sóng quảng cáo trên Đài truyền hình',
        unit: 'lần',
        condition: '0 \\le x \\le 6, x \\in \\mathbb{N}',
      },
      {
        symbol: 'y',
        meaning: 'Số lần chạy quảng cáo trên Mạng xã hội',
        unit: 'lần',
        condition: 'y \\ge 4, y \\in \\mathbb{N}',
      },
    ],
    summaryTable: {
      title: 'Bảng thông số chi phí và hiệu quả truyền thông',
      headers: ['Hình thức quảng cáo', 'Chi phí 1 lần (triệu đồng)', 'Lượng tiếp cận / lần (người)', 'Quy định số lần'],
      rows: [
        ['Đài truyền hình (x)', '4', '30.000', 'Tối đa 6 lần (0 ≤ x ≤ 6)'],
        ['Mạng xã hội (y)', '2', '20.000', 'Tối thiểu 4 lần (y ≥ 4)'],
        ['Tổng ngân sách', 'Ngân sách tối đa 32 triệu', 'F(x, y) = 30x + 20y → Max', '4x + 2y ≤ 32'],
      ],
    },
    setupExplanation: [
      'Tổng chi phí quảng cáo là 4x + 2y (triệu đồng). Ngân sách tối đa 32 triệu nên: 4x + 2y \\le 32 (rút gọn: 2x + y \\le 16).',
      'Số lần quảng cáo trên truyền hình không quá 6 lần: 0 \\le x \\le 6.',
      'Số lần quảng cáo trên mạng xã hội ít nhất 4 lần: y \\ge 4.',
      'Tổng lượng khách hàng tiềm năng tiếp cận (nghìn người) là: F(x, y) = 30x + 20y.',
    ],
    equationLatexList: [
      '\\begin{cases} 2x + y \\le 16 \\\\ 0 \\le x \\le 6 \\\\ y \\ge 4 \\end{cases}',
      'F(x, y) = 30x + 20y \\longrightarrow \\max',
    ],
    linearProgrammingData: {
      constraints: [
        {
          id: 'c1',
          label: 'd1: 2x + y = 16',
          a: 2,
          b: 1,
          op: '<=',
          c: 16,
          meaning: 'Giới hạn tổng ngân sách',
        },
        {
          id: 'c2',
          label: 'd2: x = 6',
          a: 1,
          b: 0,
          op: '<=',
          c: 6,
          meaning: 'Tối đa 6 lần trên truyền hình',
        },
        {
          id: 'c3',
          label: 'd3: y = 4',
          a: 0,
          b: 1,
          op: '>=',
          c: 4,
          meaning: 'Tối thiểu 4 lần trên mạng xã hội',
        },
      ],
      objective: {
        name: 'F(x, y)',
        a: 30,
        b: 20,
        target: 'max',
        unit: 'nghìn người',
        description: 'Tổng số người tiếp cận',
      },
      xRange: [0, 8],
      yRange: [0, 18],
    },
    solutionSteps: {
      methodTitle: 'Xác định các đỉnh miền nghiệm hình thang vuông',
      subSteps: [
        {
          title: 'Bước 1: Miền nghiệm của hệ bất phương trình',
          content: 'Miền nghiệm là hình tứ giác ABCD giới hạn bởi các đường x=0, x=6, y=4 và 2x+y=16.',
          mathLatex: 'A(0; 4), \\; B(6; 4), \\; C(6; 4) \\text{ trùng giao điểm}, \\; D(0; 16)',
        },
      ],
      vertices: [
        { name: 'A', x: 0, y: 4, xLatex: '0', yLatex: '4', fValue: 80, fValueLatex: '80' },
        { name: 'B', x: 6, y: 4, xLatex: '6', yLatex: '4', fValue: 260, fValueLatex: '260' },
        { name: 'C', x: 0, y: 16, xLatex: '0', yLatex: '16', fValue: 320, fValueLatex: '320', isOptimal: true },
      ],
    },
    conclusion: {
      overview: 'Lượng khách hàng tiếp cận tối đa là 320.000 người khi công ty dành toàn bộ ngân sách phát sóng 16 lần trên Mạng xã hội và 0 lần trên truyền hình.',
      finalAnswers: [
        { label: 'Số lần phát trên Truyền hình', value: '0 lần' },
        { label: 'Số lần chạy trên Mạng xã hội', value: '16 lần' },
        { label: 'Lượng tiếp cận tối đa', value: '320.000 khách hàng' },
      ],
      practicalImplication: 'Chi phí trên mạng xã hội rẻ hơn và hiệu quả tiếp cận trên mỗi đồng vốn cao hơn truyền hình trong bài toán này.',
    },
  },

  {
    id: 'bpt-thuong-nhan-trai-cay',
    title: 'Thương nhân mua trái cây tối ưu lợi nhuận (Vốn & Khối lượng)',
    category: 'inequality_system',
    categoryName: 'Hệ bất phương trình & Quy hoạch tuyến tính',
    grade: 'Toán 10',
    topic: 'kinh_te_tai_chinh',
    topicName: 'Kinh tế & Thương mại thực tiễn',
    statement:
      'Một thương nhân sử dụng 120 triệu đồng tiền vốn để mua tối đa 8 tấn trái cây. Thương nhân đó thu mua hai loại trái cây: Loại A có giá mua 12 triệu đồng/tấn, lợi nhuận khi bán là 1,1 triệu đồng/tấn. Loại B có giá mua 20 triệu đồng/tấn, lợi nhuận khi bán là 1,5 triệu đồng/tấn. Hỏi thương nhân đó nên mua khối lượng mỗi loại bao nhiêu tấn để thu được lợi nhuận cao nhất?',
    practicalContext:
      'Bài toán quy hoạch tuyến tính kinh điển về phân bổ vốn và giới hạn vận chuyển trong thương mại, tối đa hóa lợi nhuận trên hai loại hàng hóa.',
    variables: [
      {
        symbol: 'x',
        meaning: 'Khối lượng trái cây loại A thương nhân mua',
        unit: 'tấn',
        condition: 'x \\ge 0',
      },
      {
        symbol: 'y',
        meaning: 'Khối lượng trái cây loại B thương nhân mua',
        unit: 'tấn',
        condition: 'y \\ge 0',
      },
    ],
    summaryTable: {
      title: 'Bảng phân tích giá mua, lợi nhuận và giới hạn',
      headers: ['Đại lượng', '1 tấn Loại A', '1 tấn Loại B', 'Giới hạn khả dụng'],
      rows: [
        ['Giá mua (triệu đồng/tấn)', '12', '20', 'Tối đa 120 triệu đồng'],
        ['Khối lượng (tấn)', '1', '1', 'Tối đa 8 tấn'],
        ['Lợi nhuận (triệu đồng/tấn)', '1,1', '1,5', 'F(x, y) = 1,1x + 1,5y → Max'],
      ],
    },
    setupExplanation: [
      'Tổng khối lượng trái cây mua là x + y (tấn). Vì chỉ chở được tối đa 8 tấn nên: x + y \\le 8.',
      'Tổng số vốn cần dùng là 12x + 20y (triệu đồng). Vì chỉ có 120 triệu đồng nên: 12x + 20y \\le 120 (chia 4: 3x + 5y \\le 30).',
      'Khối lượng mỗi loại không âm: x \\ge 0 và y \\ge 0.',
      'Tổng lợi nhuận thu được (triệu đồng) là: F(x, y) = 1{,}1x + 1{,}5y.',
    ],
    equationLatexList: [
      '\\begin{cases} x + y \\le 8 \\\\ 3x + 5y \\le 30 \\\\ x \\ge 0 \\\\ y \\ge 0 \\end{cases}',
      'F(x, y) = 1{,}1x + 1{,}5y \\longrightarrow \\max',
    ],
    linearProgrammingData: {
      constraints: [
        {
          id: 'c1',
          label: 'd1: x + y = 8',
          a: 1,
          b: 1,
          op: '<=',
          c: 8,
          meaning: 'Giới hạn khối lượng vận chuyển',
        },
        {
          id: 'c2',
          label: 'd2: 3x + 5y = 30',
          a: 3,
          b: 5,
          op: '<=',
          c: 30,
          meaning: 'Giới hạn số vốn (12x + 20y ≤ 120)',
        },
      ],
      objective: {
        name: 'F(x, y)',
        a: 1.1,
        b: 1.5,
        target: 'max',
        unit: 'triệu đồng',
        description: 'Tổng lợi nhuận khi bán trái cây',
      },
      xRange: [0, 10],
      yRange: [0, 8],
    },
    solutionSteps: {
      methodTitle: 'Phương pháp hình học giải bài toán Quy hoạch tuyến tính',
      subSteps: [
        {
          title: 'Bước 1: Xác định các đường thẳng biên trên mặt phẳng tọa độ Oxy',
          content:
            'Vẽ các đường thẳng biên: (d1): x + y = 8 đi qua (0; 8) và (8; 0); (d2): 3x + 5y = 30 đi qua (0; 6) và (10; 0); cùng hai trục tọa độ x = 0 (Oy) và y = 0 (Ox).',
          mathLatex: '(d_1): x + y = 8; \\quad (d_2): 3x + 5y = 30',
        },
        {
          title: 'Bước 2: Xác định miền nghiệm (tứ giác OABC)',
          content:
            'Gạch bỏ các nửa mặt phẳng không thỏa mãn các bất phương trình. Miền nghiệm của hệ là miền tứ giác lồi OABC (kể cả bờ), với các đỉnh:',
          mathLatex: 'O(0; 0), \\; A(8; 0), \\; B(5; 3), \\; C(0; 6)',
        },
        {
          title: 'Bước 3: Tính giá trị hàm mục tiêu F(x, y) tại tất cả các đỉnh',
          content:
            'Theo định lý quy hoạch tuyến tính, giá trị lớn nhất của hàm mục tiêu F(x, y) trên miền đa giác đạt được tại một trong các đỉnh. Đỉnh B(5; 3) là giao điểm của d1 và d2: giải hệ x + y = 8 và 3x + 5y = 30 suy ra x = 5, y = 3.',
          mathLatex:
            'F(O) = 0; \\quad F(A) = 1{,}1 \\cdot 8 = 8{,}8; \\quad F(B) = 1{,}1 \\cdot 5 + 1{,}5 \\cdot 3 = 10; \\quad F(C) = 1{,}5 \\cdot 6 = 9',
        },
      ],
      vertices: [
        { name: 'O', x: 0, y: 0, xLatex: '0', yLatex: '0', fValue: 0, fValueLatex: '0' },
        { name: 'A', x: 8, y: 0, xLatex: '8', yLatex: '0', fValue: 8.8, fValueLatex: '8{,}8' },
        { name: 'B', x: 5, y: 3, xLatex: '5', yLatex: '3', fValue: 10, fValueLatex: '10', isOptimal: true },
        { name: 'C', x: 0, y: 6, xLatex: '0', yLatex: '6', fValue: 9, fValueLatex: '9' },
      ],
    },
    conclusion: {
      overview:
        'Lợi nhuận lớn nhất đạt được là 10 triệu đồng tại đỉnh B(5; 3), tức thương nhân nên mua 5 tấn trái cây loại A và 3 tấn trái cây loại B. Khi đó dùng hết 12·5 + 20·3 = 120 triệu đồng vốn và 5 + 3 = 8 tấn khối lượng, tận dụng tối đa cả hai nguồn lực.',
      finalAnswers: [
        { label: 'Khối lượng trái cây loại A', value: '5 tấn' },
        { label: 'Khối lượng trái cây loại B', value: '3 tấn' },
        { label: 'Lợi nhuận tối đa đạt được', value: '10 triệu đồng' },
      ],
      practicalImplication: 'Phương án B(5; 3) tận dụng hết cả vốn (120 triệu) và tải trọng (8 tấn), cho lợi nhuận cao nhất so với việc chỉ mua một loại.',
    },
  },

];
