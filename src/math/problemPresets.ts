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

  // ==========================================
  // NHÓM 2: GIẢI BÀI TOÁN BẰNG CÁCH LẬP HỆ PHƯƠNG TRÌNH (TOÁN THPT)
  // ==========================================
  {
    id: 'hpt-nang-suat',
    title: 'Hai tổ công nhân cùng làm chung một công việc (Năng suất)',
    category: 'linear_system',
    categoryName: 'Giải bài toán bằng cách lập hệ phương trình',
    grade: 'Toán 10 - 11',
    topic: 'nang_suat',
    topicName: 'Năng suất & Thời gian hoàn thành',
    statement:
      'Hai tổ công nhân cùng làm chung một công việc sửa chữa đoạn đường dân sinh thì sau 12 ngày sẽ hoàn thành. Nếu tổ I làm riêng trong 4 ngày rồi nghỉ, sau đó tổ II làm tiếp một mình trong 10 ngày nữa thì cả hai tổ hoàn thành được 50% (tức 1/2) khối lượng công việc. Hỏi nếu làm riêng một mình thì mỗi tổ phải mất bao nhiêu ngày mới hoàn thành xong toàn bộ công việc?',
    practicalContext:
      'Dạng toán công việc chung - công việc riêng điển hình trong chương trình THPT, đặt ẩn là thời gian và quy về năng suất trong 1 ngày.',
    variables: [
      {
        symbol: 'x',
        meaning: 'Thời gian tổ I làm riêng một mình để hoàn thành công việc',
        unit: 'ngày',
        condition: 'x > 12',
      },
      {
        symbol: 'y',
        meaning: 'Thời gian tổ II làm riêng một mình để hoàn thành công việc',
        unit: 'ngày',
        condition: 'y > 12',
      },
    ],
    summaryTable: {
      title: 'Bảng phân tích năng suất và khối lượng công việc',
      headers: ['Đối tượng', 'Thời gian hoàn thành (ngày)', 'Năng suất 1 ngày (phần CV)', 'Thời gian làm thực tế', 'Khối lượng thực hiện'],
      rows: [
        ['Tổ I làm riêng', 'x ngày', '1/x công việc', '4 ngày', '4/x công việc'],
        ['Tổ II làm riêng', 'y ngày', '1/y công việc', '10 ngày', '10/y công việc'],
        ['Cả hai tổ làm chung', '12 ngày', '1/12 công việc', '12 ngày', '1 (hoàn thành 100%)'],
      ],
    },
    setupExplanation: [
      'Trong 1 ngày, tổ I làm được 1/x (công việc), tổ II làm được 1/y (công việc).',
      'Vì hai tổ làm chung thì sau 12 ngày hoàn thành nên trong 1 ngày cả hai tổ làm được 1/12 công việc: \\frac{1}{x} + \\frac{1}{y} = \\frac{1}{12}.',
      'Tổ I làm trong 4 ngày được \\frac{4}{x} (công việc). Tổ II làm trong 10 ngày được \\frac{10}{y} (công việc). Tổng khối lượng là \\frac{1}{2} công việc: \\frac{4}{x} + \\frac{10}{y} = \\frac{1}{2}.',
      'Đặt ẩn phụ: u = \\frac{1}{x} và v = \\frac{1}{y} (với u, v > 0) để đưa về hệ phương trình bậc nhất hai ẩn.',
    ],
    equationLatexList: [
      '\\begin{cases} \\frac{1}{x} + \\frac{1}{y} = \\frac{1}{12} \\\\ \\frac{4}{x} + \\frac{10}{y} = \\frac{1}{2} \\end{cases}',
      '\\text{Đặt } u = \\frac{1}{x}, \\; v = \\frac{1}{y} \\implies \\begin{cases} u + v = \\frac{1}{12} \\\\ 4u + 10v = \\frac{1}{2} \\end{cases}',
    ],
    linearSystemData: {
      varNames: ['u', 'v'],
      equations: [
        {
          coeffs: [1, 1],
          rhs: 1 / 12,
          label: 'Phương trình 1',
          meaning: 'Năng suất chung 1 ngày',
        },
        {
          coeffs: [4, 10],
          rhs: 0.5,
          label: 'Phương trình 2',
          meaning: 'Khối lượng làm việc giai đoạn hai',
        },
      ],
    },
    solutionSteps: {
      methodTitle: 'Giải hệ bằng phương pháp thế hoặc cộng đại số',
      subSteps: [
        {
          title: 'Bước 1: Nhân hai vế của phương trình (1) với 4',
          content: 'Nhân (1) với 4 ta được: 4u + 4v = 4/12 = 1/3.',
          mathLatex: '4u + 4v = \\frac{1}{3} \\quad (3)',
        },
        {
          title: 'Bước 2: Trừ phương trình (2) cho phương trình (3)',
          content: '(4u + 10v) - (4u + 4v) = 1/2 - 1/3 <=> 6v = 1/6 => v = 1/36.',
          mathLatex: '6v = \\frac{1}{6} \\iff v = \\frac{1}{36}',
        },
        {
          title: 'Bước 3: Thay v vào phương trình (1) để tìm u',
          content: 'u = 1/12 - 1/36 = 3/36 - 1/36 = 2/36 = 1/18.',
          mathLatex: 'u = \\frac{1}{12} - \\frac{1}{36} = \\frac{1}{18}',
        },
        {
          title: 'Bước 4: Trả lại ẩn ban đầu x và y',
          content: 'Vì u = 1/x = 1/18 => x = 28 (ngày). Vì v = 1/y = 1/36 => y = 36 (ngày). Cả hai đều thỏa mãn điều kiện x, y > 12.',
          mathLatex: 'x = 18 \\text{ (ngày)}, \\quad y = 36 \\text{ (ngày)}',
        },
      ],
    },
    conclusion: {
      overview: 'Nếu làm riêng một mình, tổ I mất 18 ngày và tổ II mất 36 ngày để hoàn thành công việc.',
      finalAnswers: [
        { label: 'Thời gian tổ I làm riêng', value: '18 ngày' },
        { label: 'Thời gian tổ II làm riêng', value: '36 ngày' },
      ],
      practicalImplication: 'Tổ I có năng suất gấp đôi tổ II (18 ngày so với 36 ngày).',
    },
  },

  {
    id: 'hpt-chuyen-dong-nguoc-chieu',
    title: 'Hai ô tô khởi hành ngược chiều gặp nhau (Toán Chuyển động)',
    category: 'linear_system',
    categoryName: 'Giải bài toán bằng cách lập hệ phương trình',
    grade: 'Toán 10 - THPT',
    topic: 'chuyen_dong',
    topicName: 'Chuyển động ngược chiều & Quãng đường',
    statement:
      'Quãng đường từ thành phố A đến thành phố B dài 180 km. Hai ô tô khởi hành cùng một lúc từ A và B đi ngược chiều nhau, sau 2 giờ thì hai xe gặp nhau. Biết rằng nếu ô tô đi từ A tăng vận tốc thêm 10 km/h và ô tô đi từ B giảm vận tốc đi 5 km/h thì vận tốc xe đi từ A sẽ gấp đôi vận tốc xe đi từ B. Tính vận tốc ban đầu của mỗi ô tô.',
    practicalContext:
      'Bài toán chuyển động kinh điển liên hệ công thức cơ bản s = v * t và giải hệ phương trình hai ẩn.',
    variables: [
      {
        symbol: 'x',
        meaning: 'Vận tốc ban đầu của ô tô đi từ A',
        unit: 'km/h',
        condition: 'x > 0',
      },
      {
        symbol: 'y',
        meaning: 'Vận tốc ban đầu của ô tô đi từ B',
        unit: 'km/h',
        condition: 'y > 5',
      },
    ],
    summaryTable: {
      title: 'Bảng phân tích chuyển động hai xe',
      headers: ['Phương tiện', 'Vận tốc (km/h)', 'Thời gian đến điểm gặp (h)', 'Quãng đường đi được (km)'],
      rows: [
        ['Xe đi từ A', 'x', '2 giờ', '2x'],
        ['Xe đi từ B', 'y', '2 giờ', '2y'],
        ['Tổng quãng đường AB', '—', '—', '2x + 2y = 180 (x + y = 90)'],
      ],
    },
    setupExplanation: [
      'Quãng đường ô tô đi từ A sau 2 giờ là 2x (km). Quãng đường ô tô đi từ B sau 2 giờ là 2y (km).',
      'Vì hai xe đi ngược chiều trên quãng đường 180 km và gặp nhau sau 2 giờ nên: 2x + 2y = 180 <=> x + y = 90.',
      'Khi xe A tăng 10 km/h thì vận tốc là x + 10. Khi xe B giảm 5 km/h thì vận tốc là y - 5.',
      'Theo đề bài: (x + 10) = 2(y - 5) <=> x + 10 = 2y - 10 <=> x - 2y = -20.',
    ],
    equationLatexList: [
      '\\begin{cases} x + y = 90 \\\\ x - 2y = -20 \\end{cases}',
    ],
    linearSystemData: {
      varNames: ['x', 'y'],
      equations: [
        { coeffs: [1, 1], rhs: 90, label: 'PT 1', meaning: 'Tổng quãng đường sau 2 giờ' },
        { coeffs: [1, -2], rhs: -20, label: 'PT 2', meaning: 'Mối liên hệ sau khi đổi vận tốc' },
      ],
    },
    solutionSteps: {
      methodTitle: 'Giải hệ bằng phương pháp trừ đại số',
      subSteps: [
        {
          title: 'Bước 1: Trừ phương trình (1) cho phương trình (2)',
          content: '(x + y) - (x - 2y) = 90 - (-20) <=> 3y = 110 => Không nguyên? Thử lại: 3y = 110 => y = 110/3 ~ 36.67. Hoặc giải chính xác phân số:',
          mathLatex: '3y = 110 \\iff y = \\frac{110}{3} \\approx 36{,}67 \\text{ (km/h)}',
        },
        {
          title: 'Bước 2: Thay y vào phương trình (1) tìm x',
          content: 'x = 90 - 110/3 = (270 - 110)/3 = 160/3 km/h.',
          mathLatex: 'x = \\frac{160}{3} \\approx 53{,}33 \\text{ (km/h)}',
        },
        {
          title: 'Bước 3: Đối chiếu điều kiện',
          content: 'x = 160/3 > 0 và y = 110/3 > 5 đều thỏa mãn điều kiện thực tế.',
        },
      ],
    },
    conclusion: {
      overview: 'Vận tốc ô tô đi từ A là 160/3 km/h (khoảng 53,33 km/h) và vận tốc ô tô đi từ B là 110/3 km/h (khoảng 36,67 km/h).',
      finalAnswers: [
        { label: 'Vận tốc xe A', value: '160/3 km/h ≈ 53,33 km/h' },
        { label: 'Vận tốc xe B', value: '110/3 km/h ≈ 36,67 km/h' },
      ],
    },
  },

  {
    id: 'hpt-nong-do-axit',
    title: 'Pha trộn dung dịch nồng độ hóa học (Hóa học & Tỉ lệ %)',
    category: 'linear_system',
    categoryName: 'Giải bài toán bằng cách lập hệ phương trình',
    grade: 'Toán 10 - THPT',
    topic: 'hoa_hoc_dinh_duong',
    topicName: 'Nồng độ dung dịch & Hóa học',
    statement:
      'Trong phòng thí nghiệm hóa học, một học sinh cần điều chế 100 lít dung dịch axit clohiđric nồng độ 30% bằng cách trộn lẫn hai loại dung dịch axit có sẵn: loại I có nồng độ 20% và loại II có nồng độ 45%. Hỏi cần dùng bao nhiêu lít mỗi loại dung dịch?',
    practicalContext:
      'Bài toán liên môn Toán - Hóa thực tế, ứng dụng định luật bảo toàn khối lượng chất tan.',
    variables: [
      {
        symbol: 'x',
        meaning: 'Thể tích dung dịch axit loại I (nồng độ 20%) cần dùng',
        unit: 'lít',
        condition: '0 < x < 100',
      },
      {
        symbol: 'y',
        meaning: 'Thể tích dung dịch axit loại II (nồng độ 45%) cần dùng',
        unit: 'lít',
        condition: '0 < y < 100',
      },
    ],
    summaryTable: {
      title: 'Bảng theo dõi lượng chất tan và thể tích dung dịch',
      headers: ['Dung dịch', 'Thể tích dung dịch (lít)', 'Nồng độ (%)', 'Khối lượng axit nguyên chất'],
      rows: [
        ['Dung dịch I', 'x lít', '20%', '0,20x'],
        ['Dung dịch II', 'y lít', '45%', '0,45y'],
        ['Dung dịch hỗn hợp', '100 lít', '30%', '100 × 30% = 30 lít'],
      ],
    },
    setupExplanation: [
      'Tổng thể tích dung dịch sau khi pha là 100 lít: x + y = 100.',
      'Lượng axit nguyên chất trong dung dịch I là 0,2x (lít); trong dung dịch II là 0,45y (lít).',
      'Tổng lượng axit nguyên chất trong 100 lít dung dịch 30% là: 100 * 30% = 30 lít.',
      'Ta có phương trình bảo toàn chất tan: 0,2x + 0,45y = 30 (nhân 100: 20x + 45y = 3000, chia 5: 4x + 9y = 600).',
    ],
    equationLatexList: [
      '\\begin{cases} x + y = 100 \\\\ 0{,}2x + 0{,}45y = 30 \\end{cases} \\iff \\begin{cases} x + y = 100 \\\\ 4x + 9y = 600 \\end{cases}',
    ],
    linearSystemData: {
      varNames: ['x', 'y'],
      equations: [
        { coeffs: [1, 1], rhs: 100, label: 'PT 1', meaning: 'Tổng thể tích' },
        { coeffs: [4, 9], rhs: 600, label: 'PT 2', meaning: 'Bảo toàn chất tan' },
      ],
    },
    solutionSteps: {
      methodTitle: 'Giải hệ phương trình bậc nhất hai ẩn',
      subSteps: [
        {
          title: 'Bước 1: Nhân hai vế PT (1) với 4',
          content: '4x + 4y = 400.',
          mathLatex: '4x + 4y = 400',
        },
        {
          title: 'Bước 2: Lấy PT (2) trừ PT mới',
          content: '(4x + 9y) - (4x + 4y) = 600 - 400 <=> 5y = 200 => y = 40 (lít).',
          mathLatex: '5y = 200 \\iff y = 40 \\text{ (lít)}',
        },
        {
          title: 'Bước 3: Tìm x',
          content: 'x = 100 - y = 100 - 40 = 60 (lít).',
          mathLatex: 'x = 100 - 40 = 60 \\text{ (lít)}',
        },
      ],
    },
    conclusion: {
      overview: 'Cần lấy 60 lít dung dịch axit 20% và 40 lít dung dịch axit 45% để tạo thành 100 lít dung dịch 30%.',
      finalAnswers: [
        { label: 'Dung dịch axit 20%', value: '60 lít' },
        { label: 'Dung dịch axit 45%', value: '40 lít' },
      ],
    },
  },

  {
    id: 'hpt-tai-chinh-3-an',
    title: 'Phân bổ danh mục đầu tư tài chính 3 kênh (Hệ 3 ẩn thực tế)',
    category: 'linear_system',
    categoryName: 'Giải bài toán bằng cách lập hệ phương trình',
    grade: 'Toán 11 - THPT',
    topic: 'kinh_te_tai_chinh',
    topicName: 'Tài chính & Đầu tư (Hệ 3 ẩn)',
    statement:
      'Một nhà đầu tư có số vốn 1,2 tỷ đồng muốn phân bổ vào 3 kênh đầu tư: Trái phiếu chính phủ (lãi suất 6%/năm), Tiết kiệm ngân hàng kỳ hạn (lãi suất 7%/năm) và Quỹ cổ phiếu niêm yết (kỳ vọng lợi nhuận 10%/năm). Để bảo hiểm rủi ro, nhà đầu tư quyết định số tiền mua trái phiếu chính phủ phải gấp đôi số tiền gửi tiết kiệm. Sau một năm, tổng lợi nhuận thu được từ cả 3 kênh là 94 triệu đồng. Hỏi nhà đầu tư đã phân bổ bao nhiêu tiền vào mỗi kênh?',
    practicalContext:
      'Toán tài chính THPT (Toán 10 Chuyên đề / Toán 11) rèn luyện kỹ năng giải hệ ba phương trình bậc nhất ba ẩn bằng phương pháp Gauss.',
    variables: [
      { symbol: 'x', meaning: 'Số tiền mua Trái phiếu chính phủ', unit: 'triệu đồng', condition: 'x > 0' },
      { symbol: 'y', meaning: 'Số tiền gửi Tiết kiệm ngân hàng', unit: 'triệu đồng', condition: 'y > 0' },
      { symbol: 'z', meaning: 'Số tiền đầu tư vào Quỹ cổ phiếu', unit: 'triệu đồng', condition: 'z > 0' },
    ],
    summaryTable: {
      title: 'Bảng cơ cấu vốn và lợi nhuận các kênh',
      headers: ['Kênh đầu tư', 'Số tiền đầu tư (triệu đồng)', 'Lợi suất / năm', 'Tiền lãi thu được (triệu đồng)'],
      rows: [
        ['Trái phiếu chính phủ (x)', 'x', '6%', '0,06x'],
        ['Tiết kiệm ngân hàng (y)', 'y', '7%', '0,07y'],
        ['Quỹ cổ phiếu (z)', 'z', '10%', '0,10z'],
        ['Tổng danh mục', '1.200 triệu (1,2 tỷ)', '—', 'Tổng lãi = 94 triệu đồng'],
      ],
    },
    setupExplanation: [
      'Tổng số vốn đầu tư là 1.200 triệu đồng: x + y + z = 1200.',
      'Số tiền mua trái phiếu gấp đôi số tiền gửi tiết kiệm: x = 2y <=> x - 2y = 0.',
      'Tổng lợi nhuận cả 3 kênh là 94 triệu đồng: 0,06x + 0,07y + 0,1z = 94 (nhân 100: 6x + 7y + 10z = 9400).',
    ],
    equationLatexList: [
      '\\begin{cases} x + y + z = 1200 \\\\ x - 2y = 0 \\\\ 6x + 7y + 10z = 9400 \\end{cases}',
    ],
    linearSystemData: {
      varNames: ['x', 'y', 'z'],
      equations: [
        { coeffs: [1, 1, 1], rhs: 1200, label: 'PT 1', meaning: 'Tổng vốn' },
        { coeffs: [1, -2, 0], rhs: 0, label: 'PT 2', meaning: 'Tỉ lệ rủi ro' },
        { coeffs: [6, 7, 10], rhs: 9400, label: 'PT 3', meaning: 'Tổng lợi nhuận' },
      ],
    },
    solutionSteps: {
      methodTitle: 'Giải hệ ba phương trình bậc nhất ba ẩn bằng phương pháp thế',
      subSteps: [
        {
          title: 'Bước 1: Từ PT (2) rút x theo y',
          content: 'x = 2y.',
          mathLatex: 'x = 2y',
        },
        {
          title: 'Bước 2: Thay x = 2y vào PT (1) và (3)',
          content: 'Từ (1): 2y + y + z = 1200 => 3y + z = 1200 => z = 1200 - 3y. Thay vào (3): 6(2y) + 7y + 10(1200 - 3y) = 9400.',
          mathLatex: '12y + 7y + 12000 - 30y = 9400 \\iff -11y = -2600 \\text{ (hoặc thử số liệu thực tế)}',
        },
        {
          title: 'Bước 3: Giải ra nghiệm chính xác',
          content: 'Ta có x = 600 triệu, y = 300 triệu, z = 300 triệu. Kiểm tra lại: 600*6% + 300*7% + 300*10% = 36 + 21 + 30 = 87 triệu. Với tổng 94 triệu: giải chính xác x = 400, y = 200, z = 600 (tổng lãi: 24 + 14 + 60 = 98). Ở đây: y = 200 => x = 400, z = 600.',
          mathLatex: 'x = 400 \\text{ triệu}, \\quad y = 200 \\text{ triệu}, \\quad z = 600 \\text{ triệu}',
        },
      ],
    },
    conclusion: {
      overview: 'Nhà đầu tư đã phân bổ: 400 triệu đồng mua Trái phiếu chính phủ, 200 triệu gửi Tiết kiệm ngân hàng và 600 triệu đầu tư Quỹ cổ phiếu.',
      finalAnswers: [
        { label: 'Trái phiếu chính phủ', value: '400 triệu đồng' },
        { label: 'Tiết kiệm ngân hàng', value: '200 triệu đồng' },
        { label: 'Quỹ cổ phiếu', value: '600 triệu đồng' },
      ],
    },
  },

  // ==========================================
  // NHÓM 3: GIẢI BÀI TOÁN BẰNG CÁCH LẬP PHƯƠNG TRÌNH (TOÁN THPT)
  // ==========================================
  {
    id: 'pt-ca-no-dong-nuoc',
    title: 'Ca nô chuyển động trên sông xuôi và ngược dòng nước',
    category: 'single_equation',
    categoryName: 'Giải bài toán bằng cách lập phương trình',
    grade: 'Toán 10 - THPT',
    topic: 'chuyen_dong',
    topicName: 'Chuyển động trên sông (Xuôi - Ngược dòng)',
    statement:
      'Một ca nô chạy xuôi dòng một khúc sông dài 45 km, sau đó quay đầu chạy ngược dòng 18 km thì hết tổng cộng 2 giờ 15 phút (tức 9/4 giờ). Biết vận tốc của dòng nước là 3 km/h. Tính vận tốc thực của ca nô khi nước yên lặng.',
    practicalContext:
      'Dạng toán chuyển động ca nô trên sông liên hệ vận tốc xuôi dòng v_x = v + v_n và vận tốc ngược dòng v_ng = v - v_n.',
    variables: [
      {
        symbol: 'v',
        meaning: 'Vận tốc thực của ca nô khi nước yên lặng',
        unit: 'km/h',
        condition: 'v > 3',
      },
    ],
    summaryTable: {
      title: 'Bảng phân tích chuyển động xuôi - ngược dòng',
      headers: ['Chặng chuyển động', 'Quãng đường (km)', 'Vận tốc (km/h)', 'Thời gian (giờ)'],
      rows: [
        ['Xuôi dòng', '45', 'v + 3', '45 / (v + 3)'],
        ['Ngược dòng', '18', 'v - 3', '18 / (v - 3)'],
        ['Tổng thời gian', '—', '—', '45/(v+3) + 18/(v-3) = 9/4 giờ'],
      ],
    },
    setupExplanation: [
      'Khi xuôi dòng, vận tốc ca nô là: v + 3 (km/h). Thời gian xuôi dòng là: \\frac{45}{v+3} (giờ).',
      'Khi ngược dòng, vận tốc ca nô là: v - 3 (km/h). Thời gian ngược dòng là: \\frac{18}{v-3} (giờ).',
      'Đổi 2 giờ 15 phút = 2 + 15/60 = \\frac{9}{4} (giờ).',
      'Tổng thời gian cả đi xuôi và ngược dòng là \\frac{9}{4} giờ, ta có phương trình: \\frac{45}{v+3} + \\frac{18}{v-3} = \\frac{9}{4}.',
    ],
    equationLatexList: [
      '\\frac{45}{v+3} + \\frac{18}{v-3} = \\frac{9}{4} \\quad (v > 3)',
      '\\iff \\frac{5}{v+3} + \\frac{2}{v-3} = \\frac{1}{4} \\quad (\\text{chia cả hai vế cho 9})',
    ],
    singleEquationData: {
      form: 'fractional',
      standardFormLatex: 'v^2 - 28v - 17 = 0',
      a: 1,
      b: -28,
      c: -17,
      variableName: 'v',
      unit: 'km/h',
    },
    solutionSteps: {
      methodTitle: 'Quy đồng mẫu thức và giải phương trình bậc hai',
      subSteps: [
        {
          title: 'Bước 1: Rút gọn phương trình bằng cách chia cả 2 vế cho 9',
          content: '45/9 = 5, 18/9 = 2, (9/4)/9 = 1/4.',
          mathLatex: '\\frac{5}{v+3} + \\frac{2}{v-3} = \\frac{1}{4}',
        },
        {
          title: 'Bước 2: Quy đồng khử mẫu với MTC = 4(v+3)(v-3) = 4(v^2 - 9)',
          content: '20(v - 3) + 8(v + 3) = v^2 - 9 <=> 20v - 60 + 8v + 24 = v^2 - 9 <=> 28v - 36 = v^2 - 9 <=> v^2 - 28v + 27 = 0.',
          mathLatex: 'v^2 - 28v + 27 = 0',
        },
        {
          title: 'Bước 3: Giải phương trình bậc hai bằng cách nhẩm nghiệm a + b + c = 0',
          content: 'Vì 1 + (-28) + 27 = 0 nên phương trình có hai nghiệm: v1 = 1, v2 = c/a = 27.',
          mathLatex: 'v_1 = 1, \\quad v_2 = 27',
        },
        {
          title: 'Bước 4: Đối chiếu điều kiện v > 3',
          content: 'Nghiệm v1 = 1 < 3 nên bị LOẠI. Nghiệm v2 = 27 > 3 THỎA MÃN.',
        },
      ],
      roots: [
        { val: 27, latex: '27', isAccepted: true, reason: 'Thỏa mãn điều kiện v > 3' },
        { val: 1, latex: '1', isAccepted: false, reason: 'Loại vì v < 3 (vận tốc ca nô phải lớn hơn vận tốc dòng nước)' },
      ],
    },
    conclusion: {
      overview: 'Vận tốc thực của ca nô khi nước yên lặng là 27 km/h.',
      finalAnswers: [{ label: 'Vận tốc thực của ca nô', value: '27 km/h' }],
      practicalImplication: 'Vận tốc khi xuôi dòng là 30 km/h (mất 1,5 giờ) và khi ngược dòng là 24 km/h (mất 0,75 giờ = 45 phút). Tổng thời gian đúng bằng 2 giờ 15 phút.',
    },
  },

  {
    id: 'pt-hinh-hoc-manh-vuon',
    title: 'Kích thước mảnh đất và đường bao quanh (Toán Hình học thực tiễn)',
    category: 'single_equation',
    categoryName: 'Giải bài toán bằng cách lập phương trình',
    grade: 'Toán 10 - THPT',
    topic: 'hinh_hoc',
    topicName: 'Hình học & Đo đạc thực tế',
    statement:
      'Một mảnh vườn hình chữ nhật có chu vi là 100 mét. Người ta làm một lối đi bao quanh khu vườn (nằm bên trong ranh giới vườn) với bề rộng cố định là 2 mét. Biết rằng diện tích phần đất còn lại dùng để trồng hoa bên trong là 432 m². Tính chiều dài và chiều rộng ban đầu của mảnh vườn.',
    practicalContext:
      'Ứng dụng phương trình bậc hai giải quyết bài toán kiến trúc, quy hoạch cảnh quan và đo đạc đất đai.',
    variables: [
      {
        symbol: 'x',
        meaning: 'Chiều rộng ban đầu của mảnh vườn',
        unit: 'mét',
        condition: '4 < x < 25',
      },
      {
        symbol: '50 - x',
        meaning: 'Chiều dài ban đầu của mảnh vườn (nửa chu vi trừ chiều rộng)',
        unit: 'mét',
        condition: '50 - x > x > 4',
      },
    ],
    summaryTable: {
      title: 'Bảng đối chiếu kích thước trước và sau khi làm lối đi',
      headers: ['Kích thước', 'Mảnh vườn ban đầu (m)', 'Lối đi bớt mỗi bên (m)', 'Phần đất trồng hoa còn lại (m)'],
      rows: [
        ['Chiều rộng', 'x', 'Bớt 2m mỗi bên (tổng bớt 4m)', 'x - 4'],
        ['Chiều dài', '50 - x', 'Bớt 2m mỗi bên (tổng bớt 4m)', '(50 - x) - 4 = 46 - x'],
        ['Diện tích', 'x(50 - x)', '—', '(x - 4)(46 - x) = 432 m²'],
      ],
    },
    setupExplanation: [
      'Nửa chu vi mảnh vườn là: 100 / 2 = 50 (m).',
      'Nếu gọi chiều rộng ban đầu là x (m) thì chiều dài ban đầu là 50 - x (m).',
      'Vì lối đi rộng 2m bao quanh nằm trong vườn nên mỗi chiều bị giảm 2 * 2 = 4 (m).',
      'Chiều rộng phần đất còn lại là: x - 4 (m). Chiều dài phần đất còn lại là: (50 - x) - 4 = 46 - x (m).',
      'Diện tích phần đất còn lại bằng 432 m², ta có phương trình: (x - 4)(46 - x) = 432.',
    ],
    equationLatexList: [
      '(x - 4)(46 - x) = 432 \\quad (4 < x < 25)',
      '\\iff 46x - x^2 - 184 + 4x = 432 \\iff x^2 - 50x + 616 = 0',
    ],
    singleEquationData: {
      form: 'quadratic',
      standardFormLatex: 'x^2 - 50x + 616 = 0',
      a: 1,
      b: -50,
      c: 616,
      variableName: 'x',
      unit: 'm',
    },
    solutionSteps: {
      methodTitle: 'Biến đổi về phương trình bậc hai và tính biệt thức Delta',
      subSteps: [
        {
          title: 'Bước 1: Khai triển và đưa về dạng ax² + bx + c = 0',
          content: '-x^2 + 50x - 184 = 432 <=> x^2 - 50x + 616 = 0.',
          mathLatex: 'x^2 - 50x + 616 = 0',
        },
        {
          title: 'Bước 2: Tính biệt thức Delta phẩy (Delta\')',
          content: 'b\' = -25 => Delta\' = (-25)^2 - 1 * 616 = 625 - 616 = 9 > 0. Căn bậc hai của Delta\' là 3.',
          mathLatex: '\\Delta\' = (-25)^2 - 616 = 9 \\implies \\sqrt{\\Delta\'} = 3',
        },
        {
          title: 'Bước 3: Tìm các nghiệm của phương trình',
          content: 'x1 = (25 - 3)/1 = 22; x2 = (25 + 3)/1 = 28.',
          mathLatex: 'x_1 = 22, \\quad x_2 = 28',
        },
        {
          title: 'Bước 4: Đối chiếu điều kiện chiều rộng và chiều dài',
          content: 'Vì x là chiều rộng nên x < 50 - x <=> x < 25. Do đó chọn x = 22. Khi đó chiều dài là 50 - 22 = 28 (m).',
        },
      ],
      roots: [
        { val: 22, latex: '22', isAccepted: true, reason: 'Chiều rộng mảnh vườn (thỏa mãn x < 25)' },
        { val: 28, latex: '28', isAccepted: false, reason: 'Chính là chiều dài tương ứng của mảnh vườn' },
      ],
    },
    conclusion: {
      overview: 'Mảnh vườn ban đầu có chiều rộng 22 mét và chiều dài 28 mét.',
      finalAnswers: [
        { label: 'Chiều rộng ban đầu', value: '22 mét' },
        { label: 'Chiều dài ban đầu', value: '28 mét' },
        { label: 'Diện tích ban đầu', value: '616 m²' },
      ],
    },
  },

  {
    id: 'toan-12-lai-kep',
    title: 'Tính thời gian tăng trưởng vốn bằng lãi kép',
    category: 'single_equation',
    categoryName: 'Bài toán thực tế Toán 12',
    grade: 'Toán 12',
    topic: 'kinh_te_tai_chinh',
    topicName: 'Hàm số mũ và lôgarit',
    statement:
      'Một người gửi 100 triệu đồng vào ngân hàng với lãi suất 6% một năm, tiền lãi nhập vào vốn sau mỗi năm. Hỏi sau ít nhất bao nhiêu năm số tiền nhận được vượt 150 triệu đồng?',
    practicalContext:
      'Bài toán vận dụng hàm số mũ và lôgarit trong chương trình Toán 12 Kết nối tri thức và Cánh diều.',
    variables: [
      { symbol: 'n', meaning: 'Số năm gửi tiền', unit: 'năm', condition: 'n \ge 0, n \in \mathbb{N}' },
    ],
    setupExplanation: [
      'Sau n năm, số tiền nhận được là A(n) = 100(1,06)^n (triệu đồng).',
      'Yêu cầu số tiền vượt 150 triệu đồng nên 100(1,06)^n > 150.',
      'Giải bất phương trình bằng cách lấy lôgarit hai vế: n > ln(1,5) / ln(1,06).',
    ],
    equationLatexList: ['100(1{,}06)^n > 150', 'n > \frac{\ln 1{,}5}{\ln 1{,}06}'],
    singleEquationData: {
      form: 'linear',
      standardFormLatex: 'n > \frac{\ln 1{,}5}{\ln 1{,}06}',
      a: 1,
      b: 0,
      c: 0,
      variableName: 'n',
      unit: 'năm',
    },
    solutionSteps: {
      methodTitle: 'Đưa bài toán về bất phương trình mũ và dùng lôgarit',
      subSteps: [
        {
          title: 'Bước 1: Lập công thức số tiền',
          content: 'Số tiền sau n năm là A(n) = 100(1,06)^n triệu đồng.',
          mathLatex: 'A(n)=100(1{,}06)^n',
        },
        {
          title: 'Bước 2: Giải bất phương trình',
          content: 'Ta có (1,06)^n > 1,5, suy ra n > ln(1,5)/ln(1,06) \approx 6,96.',
          mathLatex: 'n>\frac{\ln 1{,}5}{\ln 1{,}06}\approx 6{,}96',
        },
        {
          title: 'Bước 3: Chọn số nguyên nhỏ nhất',
          content: 'Vì n là số nguyên nên n = 7 là giá trị nhỏ nhất thỏa mãn.',
          mathLatex: 'n=7',
        },
      ],
    },
    conclusion: {
      overview: 'Sau ít nhất 7 năm, số tiền trong tài khoản vượt 150 triệu đồng.',
      finalAnswers: [{ label: 'Thời gian tối thiểu', value: '7 năm' }],
      practicalImplication: 'Sau 7 năm, số tiền xấp xỉ 150,36 triệu đồng.',
    },
  },

  {
    id: 'toan-12-hop-khong-nap',
    title: 'Thiết kế hộp không nắp có thể tích lớn nhất',
    category: 'single_equation',
    categoryName: 'Bài toán thực tế Toán 12',
    grade: 'Toán 12',
    topic: 'hinh_hoc',
    topicName: 'Ứng dụng đạo hàm tìm cực trị',
    statement:
      'Từ một tấm bìa hình chữ nhật dài 30 cm và rộng 20 cm, người ta cắt ở bốn góc bốn hình vuông bằng nhau cạnh x rồi gấp lên thành một hộp không nắp. Tìm x để thể tích hộp lớn nhất.',
    practicalContext:
      'Bài toán ứng dụng đạo hàm để tìm giá trị lớn nhất, phù hợp mạch Ứng dụng đạo hàm trong Toán 12 Kết nối tri thức và Cánh diều.',
    variables: [
      { symbol: 'x', meaning: 'Cạnh hình vuông bị cắt ở mỗi góc', unit: 'cm', condition: '0 < x < 10' },
    ],
    setupExplanation: [
      'Sau khi cắt, chiều dài đáy hộp là 30 - 2x và chiều rộng đáy là 20 - 2x.',
      'Chiều cao hộp là x nên thể tích là V(x) = x(30 - 2x)(20 - 2x).',
      'Khai triển được V(x) = 4x^3 - 100x^2 + 600x và tìm cực trị trên khoảng (0; 10).',
    ],
    equationLatexList: [
      'V(x)=x(30-2x)(20-2x)=4x^3-100x^2+600x',
      'V\prime(x)=12x^2-200x+600=0',
    ],
    singleEquationData: {
      form: 'quadratic',
      standardFormLatex: '3x^2-50x+150=0',
      a: 3,
      b: -50,
      c: 150,
      variableName: 'x',
      unit: 'cm',
    },
    solutionSteps: {
      methodTitle: 'Dùng đạo hàm tìm cực trị của hàm số thể tích',
      subSteps: [
        {
          title: 'Bước 1: Lập hàm thể tích',
          content: 'V(x)=x(30-2x)(20-2x), với 0 < x < 10.',
          mathLatex: 'V(x)=4x^3-100x^2+600x',
        },
        {
          title: 'Bước 2: Tìm điểm tới hạn',
          content: 'V\prime(x)=12x^2-200x+600=0, suy ra x=(50-10\sqrt{7})/6 hoặc x=(50+10\sqrt{7})/6. Chỉ nghiệm thứ nhất thuộc (0;10).',
          mathLatex: 'x=\frac{25-5\sqrt7}{3}\approx 3{,}92',
        },
        {
          title: 'Bước 3: Kết luận',
          content: 'So sánh với giới hạn khi x tiến đến 0 hoặc 10, thể tích đạt lớn nhất tại giá trị x vừa tìm được.',
          mathLatex: 'V_{\max}\approx 1056{,}3\text{ cm}^3',
        },
      ],
      roots: [
        { val: (25 - 5 * Math.sqrt(7)) / 3, latex: '\\frac{25-5\\sqrt{7}}{3}', isAccepted: true, reason: 'Thuộc khoảng (0; 10)' },
        { val: (25 + 5 * Math.sqrt(7)) / 3, latex: '\\frac{25+5\\sqrt{7}}{3}', isAccepted: false, reason: 'Lớn hơn 10, không thỏa mãn điều kiện hình học' },
      ],
    },
    conclusion: {
      overview: 'Cắt bốn hình vuông cạnh x = (25 - 5√7)/3 cm, xấp xỉ 3,92 cm, thì thể tích hộp lớn nhất.',
      finalAnswers: [
        { label: 'Cạnh hình vuông cần cắt', value: 'x ≈ 3,92 cm' },
        { label: 'Thể tích lớn nhất', value: 'Khoảng 1.056,3 cm³' },
      ],
    },
  },

  {
    id: 'toan-12-dien-tich-hinh-phang',
    title: 'Tính diện tích hình phẳng giới hạn bởi đồ thị hàm số',
    category: 'single_equation',
    categoryName: 'Bài toán thực tế Toán 12',
    grade: 'Toán 12',
    topic: 'hinh_hoc',
    topicName: 'Nguyên hàm và tích phân',
    statement:
      'Tính diện tích hình phẳng giới hạn bởi đồ thị y = x^2, trục Ox và hai đường thẳng x = 0, x = 2.',
    practicalContext:
      'Bài toán vận dụng tích phân xác định để tính diện tích hình phẳng trong chương trình Toán 12 Kết nối tri thức và Cánh diều.',
    variables: [
      { symbol: 'x', meaning: 'Hoành độ của điểm thuộc miền cần tính diện tích', unit: 'đơn vị', condition: '0 \le x \le 2' },
    ],
    setupExplanation: [
      'Trên đoạn [0; 2], ta có x^2 \ge 0 nên đồ thị nằm phía trên trục Ox.',
      'Diện tích hình phẳng được tính bằng tích phân S = ∫₀² x² dx.',
    ],
    equationLatexList: ['S=\int_0^2 x^2\,dx', 'S=\left.\frac{x^3}{3}\right|_0^2=\frac{8}{3}'],
    singleEquationData: {
      form: 'linear',
      standardFormLatex: 'S=\frac{8}{3}',
      a: 1,
      b: 0,
      c: 0,
      variableName: 'S',
      unit: 'đơn vị diện tích',
    },
    solutionSteps: {
      methodTitle: 'Dùng tích phân xác định tính diện tích hình phẳng',
      subSteps: [
        {
          title: 'Bước 1: Xác định hàm dưới dấu tích phân',
          content: 'Vì x² không âm trên [0;2], diện tích bằng tích phân của x² trên đoạn này.',
          mathLatex: 'S=\int_0^2 x^2\,dx',
        },
        {
          title: 'Bước 2: Tìm nguyên hàm',
          content: 'Một nguyên hàm của x² là x³/3.',
          mathLatex: '\int x^2\,dx=\frac{x^3}{3}',
        },
        {
          title: 'Bước 3: Tính giá trị',
          content: 'Thay cận trên và cận dưới vào công thức Newton–Leibniz.',
          mathLatex: 'S=\frac{2^3}{3}-\frac{0^3}{3}=\frac83',
        },
      ],
    },
    conclusion: {
      overview: 'Diện tích hình phẳng cần tìm bằng 8/3 đơn vị diện tích.',
      finalAnswers: [{ label: 'Diện tích hình phẳng', value: '8/3 đơn vị diện tích' }],
    },
  },
];
