import { getSettings } from "@/lib/store";
import { updateSettingsAction } from "@/lib/actions";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <div className="px-5 pt-4 pb-1 md:px-8">
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="mt-1 text-[13px] text-ink-soft">
          Business details used across the site — the customer pages, confirmation screen, and order threshold all
          read from here.
        </p>
      </div>

      <form action={updateSettingsAction} className="px-5 pt-4 pb-10 md:max-w-md md:px-8">
        <div className="rounded-xl border border-line bg-surface p-5">
          <Field label="Business name" name="businessName" defaultValue={settings.businessName} required />
          <Field label="Business phone" name="businessPhone" defaultValue={settings.businessPhone} required />
          <Field
            label="Notification email"
            name="notificationEmail"
            type="email"
            defaultValue={settings.notificationEmail}
            placeholder="where new-order alerts go"
          />
          <Field label="Venmo handle" name="venmoHandle" defaultValue={settings.venmoHandle} />
          <div className="mt-3">
            <label className="mb-1 block text-xs text-ink-faint">Guest threshold (orders at or above this need a call)</label>
            <input
              name="guestThreshold"
              type="number"
              min="1"
              step="1"
              defaultValue={settings.guestThreshold}
              required
              className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-[13.5px]"
            />
          </div>
        </div>

        <button type="submit" className="mt-4 w-full rounded-lg bg-indigo py-3 text-[13.5px] font-semibold text-white">
          Save settings
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="mt-3 first:mt-0">
      <label className="mb-1 block text-xs text-ink-faint">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-[13.5px]"
      />
    </div>
  );
}
