interface BatchSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const batchValues = [
  "5th CBSE Morning",
  "5th CBSE Evening",
  "6th CBSE Morning",
  "6th CBSE Evening",
  "7th CBSE Morning",
  "7th CBSE Evening",
  "8th CBSE Morning",
  "8th CBSE Evening",
  "9th CBSE Morning",
  "9th CBSE Evening",
  "10th CBSE Morning",
  "10th CBSE Evening",
  "11th CBSE Integrated Morning",
  "11th CBSE Non-Integrated Evening",
  "12th CBSE Integrated Morning",
  "12th CBSE Non-Integrated Evening",
  "5th ICSE Morning",
  "5th ICSE Evening",
  "6th ICSE Morning",
  "6th ICSE Evening",
  "7th ICSE Morning",
  "7th ICSE Evening",
  "8th ICSE Morning",
  "8th ICSE Evening",
  "9th ICSE Morning",
  "9th ICSE Evening",
  "10th ICSE Morning",
  "10th ICSE Evening",
  "5th SSC Morning",
  "5th SSC Evening",
  "6th SSC Morning",
  "6th SSC Evening",
  "7th SSC Morning",
  "7th SSC Evening",
  "8th SSC Morning",
  "8th SSC Evening",
  "9th SSC Morning",
  "9th SSC Evening",
  "10th SSC Morning",
  "10th SSC Evening",
  "JEE Foundation Morning",
  "JEE Foundation Evening",
  "NEET Foundation Morning",
  "NEET Foundation Evening",
  "MHT-CET Foundation Morning",
  "MHT-CET Foundation Evening",
];

export default function BatchSelect({
  value,
  onChange,
  required = false,
}: BatchSelectProps) {
  const hasUnknownSavedBatch = value && !batchValues.includes(value);

  return (
    <label className="block">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        Batch
      </span>

      <select
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition"
      >
        <option value="" disabled>
          Select Institutional Batch
        </option>

        {hasUnknownSavedBatch && (
          <option value={value}>{value} Current Saved Batch</option>
        )}

        <optgroup label="CBSE 5th to 12th">
          <option value="5th CBSE Morning">5th CBSE Morning</option>
          <option value="5th CBSE Evening">5th CBSE Evening</option>
          <option value="6th CBSE Morning">6th CBSE Morning</option>
          <option value="6th CBSE Evening">6th CBSE Evening</option>
          <option value="7th CBSE Morning">7th CBSE Morning</option>
          <option value="7th CBSE Evening">7th CBSE Evening</option>
          <option value="8th CBSE Morning">8th CBSE Morning</option>
          <option value="8th CBSE Evening">8th CBSE Evening</option>
          <option value="9th CBSE Morning">9th CBSE Morning</option>
          <option value="9th CBSE Evening">9th CBSE Evening</option>
          <option value="10th CBSE Morning">10th CBSE Morning</option>
          <option value="10th CBSE Evening">10th CBSE Evening</option>
          <option value="11th CBSE Integrated Morning">
            11th CBSE Integrated
          </option>
          <option value="11th CBSE Non-Integrated Evening">
            11th CBSE Non-Integrated
          </option>
          <option value="12th CBSE Integrated Morning">
            12th CBSE Integrated
          </option>
          <option value="12th CBSE Non-Integrated Evening">
            12th CBSE Non-Integrated
          </option>
        </optgroup>

        <optgroup label="ICSE 5th to 10th">
          <option value="5th ICSE Morning">5th ICSE Morning</option>
          <option value="5th ICSE Evening">5th ICSE Evening</option>
          <option value="6th ICSE Morning">6th ICSE Morning</option>
          <option value="6th ICSE Evening">6th ICSE Evening</option>
          <option value="7th ICSE Morning">7th ICSE Morning</option>
          <option value="7th ICSE Evening">7th ICSE Evening</option>
          <option value="8th ICSE Morning">8th ICSE Morning</option>
          <option value="8th ICSE Evening">8th ICSE Evening</option>
          <option value="9th ICSE Morning">9th ICSE Morning</option>
          <option value="9th ICSE Evening">9th ICSE Evening</option>
          <option value="10th ICSE Morning">10th ICSE Morning</option>
          <option value="10th ICSE Evening">10th ICSE Evening</option>
        </optgroup>

        <optgroup label="SSC 5th to 10th">
          <option value="5th SSC Morning">5th SSC Morning</option>
          <option value="5th SSC Evening">5th SSC Evening</option>
          <option value="6th SSC Morning">6th SSC Morning</option>
          <option value="6th SSC Evening">6th SSC Evening</option>
          <option value="7th SSC Morning">7th SSC Morning</option>
          <option value="7th SSC Evening">7th SSC Evening</option>
          <option value="8th SSC Morning">8th SSC Morning</option>
          <option value="8th SSC Evening">8th SSC Evening</option>
          <option value="9th SSC Morning">9th SSC Morning</option>
          <option value="9th SSC Evening">9th SSC Evening</option>
          <option value="10th SSC Morning">10th SSC Morning</option>
          <option value="10th SSC Evening">10th SSC Evening</option>
        </optgroup>

        <optgroup label="Competitive Entrance Tracks">
          <option value="JEE Foundation Morning">JEE Foundation Morning</option>
          <option value="JEE Foundation Evening">JEE Foundation Evening</option>
          <option value="NEET Foundation Morning">NEET Foundation Morning</option>
          <option value="NEET Foundation Evening">NEET Foundation Evening</option>
          <option value="MHT-CET Foundation Morning">
            MHT-CET Foundation Morning
          </option>
          <option value="MHT-CET Foundation Evening">
            MHT-CET Foundation Evening
          </option>
        </optgroup>
      </select>
    </label>
  );
}